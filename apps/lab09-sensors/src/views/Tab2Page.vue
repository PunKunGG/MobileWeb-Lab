<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>สถิติการออกกำลังกาย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>สรุปผลการฝึก</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>
            จำนวนครั้งทั้งหมด: <strong>{{ totalReps }}</strong>
          </p>
          <p>
            คะแนนสะสม: <strong>{{ totalScore }}</strong>
          </p>
          <p>
            สถานะล่าสุด: <em>{{ lastMessage }}</em>
          </p>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>หมายเหตุ</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>
            หน้านี้เตรียมไว้สำหรับแสดงสถิติการออกกำลังกายจาก Tab 1
            ในเวอร์ชันถัดไปจะเชื่อมข้อมูลจริงจากระบบนับ Motion Sensor
          </p>
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
} from "@ionic/vue";
import { ref } from "vue";

// ตอนนี้ยังเป็น mock data (ไว้โชว์ UI)
const totalReps = ref(6);
const totalScore = ref(5);
const lastMessage = ref("ยังไม่มีข้อมูลสถิติ");
</script>
