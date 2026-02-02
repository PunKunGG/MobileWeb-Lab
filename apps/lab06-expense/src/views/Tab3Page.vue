<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>กราฟรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <canvas ref="chartCanvas"></canvas>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";

import { ref, onMounted, onUnmounted } from "vue";
import { Chart, registerables } from "chart.js";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

Chart.register(...registerables);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
    let income = 0;
    let expense = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.type === "income") {
        income += data.amount;
      } else {
        expense += data.amount;
      }
    });

    renderChart(income, expense);
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
  if (chart) chart.destroy();
});

const renderChart = (income: number, expense: number) => {
  if (!chartCanvas.value) return;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(chartCanvas.value, {
    type: "pie",
    data: {
      labels: ["รายรับ", "รายจ่าย"],
      datasets: [
        {
          data: [income, expense],
          backgroundColor: ["#2dd36f", "#eb445a"],
        },
      ],
    },
  });
};
</script>
