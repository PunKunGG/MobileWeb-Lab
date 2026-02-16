// src/core/ai.interface.ts

export interface ImageAnalysisResult {
  caption: string; // คำอธิบายภาพสั้น ๆ
  tags: string[]; // คีย์เวิร์ดที่เกี่ยวข้องกับภาพ
  objects: string[]; // สิ่งของ/วัตถุที่ตรวจพบในภาพ
}
