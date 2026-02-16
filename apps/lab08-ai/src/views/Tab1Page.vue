<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lab08 - Image Analysis</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- File input -->
      <input type="file" accept="image/*" @change="onFileChange" />

      <!-- Preview image -->
      <img
        v-if="preview"
        :src="preview"
        style="max-width: 100%; border-radius: 12px; margin: 12px 0"
      />

      <!-- Analyze button -->
      <ion-button
        expand="block"
        class="ion-margin-top"
        @click="analyze"
        :disabled="!file || loading"
      >
        วิเคราะห์ภาพ
      </ion-button>

      <!-- Loading -->
      <div v-if="loading" class="ion-margin-top">
        <ion-spinner />
        <ion-text color="medium" class="ion-margin-start">
          กำลังประมวลผลด้วย Gemini AI...
        </ion-text>
      </div>

      <!-- Result -->
      <ion-card v-if="result">
        <ion-card-header>
          <ion-card-title>คำอธิบายภาพ</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>{{ result.description }}</p>

          <h3>Tags</h3>
          <ion-chip v-for="t in result.tags" :key="t">
            {{ t }}
          </ion-chip>

          <h3 style="margin-top: 12px">Objects</h3>
          <ul>
            <li v-for="o in result.objects" :key="o">{{ o }}</li>
          </ul>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { fileToBase64 } from "@/core/photo.service";
import { analyzeImage } from "@/core/gemini.service";
import type { ImageAnalysisResult } from "@/core/ai.interface";

const file = ref<File | null>(null);
const preview = ref<string | null>(null);
const loading = ref(false);
const result = ref<ImageAnalysisResult | null>(null);

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    file.value = input.files[0];
    preview.value = URL.createObjectURL(file.value); // preview
  }
}

async function analyze() {
  if (!file.value) return;

  loading.value = true;
  result.value = null;

  try {
    const base64 = await fileToBase64(file.value);
    const res = await analyzeImage(base64);
    result.value = res;
  } catch (err) {
    console.error(err);
    alert("วิเคราะห์ภาพไม่สำเร็จ ดู console เพื่อดู error");
  } finally {
    loading.value = false;
  }
}
</script>
