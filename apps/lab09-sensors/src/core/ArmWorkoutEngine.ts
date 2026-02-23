import type { AccelSample, WorkoutState } from "./types";

export class ArmWorkoutEngine {
  private listeners = new Set<(s: WorkoutState) => void>();
  private lastRepTime = 0;
  private peak = 0;
  private valley = 0;
  private phase: "WAIT_UP" | "WAIT_DOWN" = "WAIT_UP";

  state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: { repsTotal: 0, repsOk: 0, repsBad: 0, score: 0, avgRepMs: 0 },
  };

  onChange(cb: (s: WorkoutState) => void) {
    this.listeners.add(cb);
    cb(this.clone());
    return () => this.listeners.delete(cb);
  }

  private emit() {
    const snap = this.clone();
    this.listeners.forEach((cb) => cb(snap));
  }

  private clone(): WorkoutState {
    return JSON.parse(JSON.stringify(this.state));
  }

  start() {
    this.state.status = "RUNNING";
    this.state.repDisplay = 0;
    this.state.stats = {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
    };
    this.phase = "WAIT_UP";
    this.emit();
  }

  stop() {
    this.state.status = "STOPPED";
    this.emit();
  }

  process(s: AccelSample) {
    if (this.state.status !== "RUNNING") return;

    console.log("AY:", s.ay, "AX:", s.ax, "AZ:", s.az);

    const y = s.ay;
    const side = Math.abs(s.ax) + Math.abs(s.az);

    const UP_TH = 2.0;
    const DOWN_TH = -1.5;
    const MIN_ROM = 3.0;
    const MIN_MS = 700;
    const MAX_MS = 3500;

    if (this.phase === "WAIT_UP") {
      this.peak = Math.max(this.peak, y);
      if (y > UP_TH) this.phase = "WAIT_DOWN";
    } else {
      this.valley = Math.min(this.valley, y);
      if (y < DOWN_TH) {
        const now = s.t;
        const repMs = now - this.lastRepTime;
        this.lastRepTime = now;

        this.state.stats.repsTotal++;

        const rom = this.peak - this.valley;
        let ok = true;
        let msg = "OK";

        if (rom < MIN_ROM) ((msg = "ยกแขนต่ำเกินไป"), (ok = false));
        else if (repMs < MIN_MS) ((msg = "เร็วเกินไป"), (ok = false));
        else if (repMs > MAX_MS) ((msg = "ช้าเกินไป"), (ok = false));
        else if (side > 5) ((msg = "กรุณายกแนวตั้ง"), (ok = false));

        if (ok) {
          this.state.repDisplay++;
          this.state.stats.repsOk++;
          this.state.stats.score++;
          this.state.stats.avgRepMs = Math.round(
            (this.state.stats.avgRepMs + repMs) / 2,
          );
        } else {
          this.state.stats.repsBad++;
        }

        this.state.stats.lastMessage = msg;
        this.phase = "WAIT_UP";
        this.peak = 0;
        this.valley = 0;
        this.emit();
      }
    }
  }
}
