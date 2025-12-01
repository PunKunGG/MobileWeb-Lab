const canvas = document.getElementById("logoCanvas");
const ctx = canvas.getContext("2d");

let glow = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let r = 20 + Math.sin(glow) * 4;

  // แสงเรืองจาง ๆ
  ctx.beginPath();
  ctx.arc(40, 40, r, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 120, 50, ${0.8})`;
  ctx.lineWidth = 8;
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#FF5722";
  ctx.stroke();

  ctx.shadowBlur = 0;

  // ตัวหนังสือ KKU แบบ Glow
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowBlur = 12;
  ctx.shadowColor = "#FF9100";
  ctx.font = "bold 28px Kanit";
  ctx.fillText("KKU", 80, 55);

  ctx.shadowBlur = 0;

  glow += 0.1;
  requestAnimationFrame(draw);
}

draw();
