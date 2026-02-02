<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>สรุปรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>สรุปยอดทั้งหมด</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item>
            <ion-label>รายรับทั้งหมด</ion-label>
            <ion-text color="success">{{ totalIncome }} บาท</ion-text>
          </ion-item>

          <ion-item>
            <ion-label>รายจ่ายทั้งหมด</ion-label>
            <ion-text color="danger">{{ totalExpense }} บาท</ion-text>
          </ion-item>

          <ion-item>
            <ion-label>คงเหลือ</ion-label>
            <ion-text :color="balance >= 0 ? 'primary' : 'danger'">
              {{ balance }} บาท
            </ion-text>
          </ion-item>
        </ion-card-content>
      </ion-card>
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/vue";

import { ref, onMounted, onUnmounted } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

const totalIncome = ref(0);
const totalExpense = ref(0);
const balance = ref(0);

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

    totalIncome.value = income;
    totalExpense.value = expense;
    balance.value = income - expense;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
