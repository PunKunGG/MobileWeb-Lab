<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lab09 Sensors</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="center">
        <h1 class="counter">{{ state?.repDisplay ?? 0 }}</h1>
        <p class="status">สถานะ: {{ state?.status ?? "IDLE" }}</p>
      </div>

      <ion-card>
        <ion-card-header>
          <ion-card-title>สถิติการออกกำลังกาย</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>คะแนน: {{ state?.stats.score ?? 0 }}</p>
          <p>รอบทั้งหมด: {{ state?.stats.repsTotal ?? 0 }}</p>
          <p>รอบถูก: {{ state?.stats.repsOk ?? 0 }}</p>
          <p>รอบผิด: {{ state?.stats.repsBad ?? 0 }}</p>
          <p>
            ความถูกต้อง:
            {{
              state?.stats.repsTotal
                ? Math.round((state.stats.repsOk / state.stats.repsTotal) * 100)
                : 0
            }}
            %
          </p>
          <p class="msg">{{ state?.stats.lastMessage }}</p>
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" @click="start">Start</ion-button>
      <ion-button expand="block" color="medium" @click="stop">Stop</ion-button>

      <!-- ปุ่มจำลองสำหรับเทสบนเว็บ -->
      <ion-button expand="block" color="tertiary" @click="simulateOk">
        Simulate: ถูกต้อง
      </ion-button>

      <ion-button expand="block" color="warning" @click="simulateFast">
        Simulate: เร็วเกินไป
      </ion-button>

      <ion-button expand="block" color="warning" @click="simulateSlow">
        Simulate: ช้าเกินไป
      </ion-button>

      <ion-button expand="block" color="warning" @click="simulateLow">
        Simulate: ยกไม่สุด
      </ion-button>

      <ion-button expand="block" color="danger" @click="simulateTilt">
        Simulate: เอียงข้าง
      </ion-button>

      <ion-text color="medium">
        <p class="hint">
          * โหมด Simulate ใช้สำหรับทดสอบ logic บนเว็บ (Browser) * Motion Sensor
          จริงจะทำงานเมื่อ Build ลง Android เท่านั้น
        </p>
      </ion-text>
    </ion-content>

    <ion-footer class="ion-padding footer">
      663380026-5 ศิวภาส ภูศรีอ่อน
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { HapticsService } from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/armWorkoutEngine"; // ระวังตัวพิมพ์ใหญ่
import type { WorkoutState } from "../core/types";

const state = ref<WorkoutState | null>(null);

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();
const haptics = new HapticsService();

onMounted(() => {
  engine.onChange((s) => {
    state.value = s;

    // ถ้านับรอบถูก ให้สั่น (ทำงานจริงบนมือถือ)
    if (s.stats.lastMessage === "OK") {
      haptics.success();
    }
  });
});

async function start() {
  await tts.speak("เริ่มกายบริหารแขน ยกขึ้นจนสุดแล้วลดลง");
  engine.start();
  await motion.start((s) => engine.process(s));
}

async function stop() {
  await motion.stop();
  engine.stop();
}

// โหมดจำลองการยกแขน สำหรับเทสบนเว็บ
function simulateOk() {
  const now = Date.now();
  engine.process({ ax: 0.1, ay: 3.5, az: 0.1, t: now });
  setTimeout(() => {
    engine.process({ ax: 0.1, ay: -2.5, az: 0.1, t: Date.now() });
  }, 1000);
}

function simulateFast() {
  const now = Date.now();
  engine.process({ ax: 0.1, ay: 3.5, az: 0.1, t: now });
  setTimeout(() => {
    engine.process({ ax: 0.1, ay: -2.5, az: 0.1, t: Date.now() });
  }, 300); // เร็วเกินไป
}

function simulateSlow() {
  const now = Date.now();
  engine.process({ ax: 0.1, ay: 3.5, az: 0.1, t: now });
  setTimeout(() => {
    engine.process({ ax: 0.1, ay: -2.5, az: 0.1, t: Date.now() });
  }, 4200); // ช้าเกินไป
}

function simulateLow() {
  const now = Date.now();
  engine.process({ ax: 0.1, ay: 1.2, az: 0.1, t: now }); // ยกไม่สุด
  setTimeout(() => {
    engine.process({ ax: 0.1, ay: -0.8, az: 0.1, t: Date.now() });
  }, 1200);
}

function simulateTilt() {
  const now = Date.now();
  engine.process({ ax: 3.5, ay: 3.5, az: 2.5, t: now }); // เอียงข้าง
  setTimeout(() => {
    engine.process({ ax: 3.5, ay: -2.5, az: 2.5, t: Date.now() });
  }, 1200);
}
</script>

<style scoped>
.center {
  text-align: center;
  margin-bottom: 16px;
}

.counter {
  font-size: 64px;
  font-weight: bold;
}

.status {
  color: #666;
}

.msg {
  margin-top: 8px;
  font-weight: bold;
  color: #d97706;
}

.footer {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.hint {
  font-size: 12px;
  margin-top: 12px;
  text-align: center;
  opacity: 0.8;
}
</style>
