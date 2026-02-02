<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input
        label="ชื่อรายการ"
        label-placement="stacked"
        v-model="title"
        placeholder="เช่น ค่าอาหาร"
      />

      <ion-input
        label="จำนวนเงิน"
        label-placement="stacked"
        type="number"
        v-model="amount"
        placeholder="0"
      />

      <ion-select label="ประเภท" label-placement="stacked" v-model="type">
        <ion-select-option value="income">รายรับ</ion-select-option>
        <ion-select-option value="expense">รายจ่าย</ion-select-option>
      </ion-select>

      <ion-input
        label="หมวดหมู่"
        label-placement="stacked"
        v-model="category"
        placeholder="เช่น อาหาร / เดินทาง"
      />

      <ion-textarea label="หมายเหตุ" label-placement="stacked" v-model="note" />

      <ion-button expand="block" class="ion-margin-top" @click="saveExpense">
        บันทึกข้อมูล
      </ion-button>
      <ion-button
        expand="block"
        fill="outline"
        color="medium"
        class="ion-margin-top"
        @click="goBack"
      >
        กลับหน้า Tab1
      </ion-button>
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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
} from "@ionic/vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

const goBack = () => {
  router.push("/tabs/tab1");
};

console.log("AddExpense mounted"); // 🧪 debug

const router = useRouter();

const title = ref("");
const amount = ref(""); // ✅ ต้องเป็น string
const type = ref("expense");
const category = ref("");
const note = ref("");

const saveExpense = async () => {
  console.log("CLICK SAVE", title.value, amount.value);

  if (!title.value || !amount.value) {
    alert("กรุณากรอกชื่อรายการและจำนวนเงิน");
    return;
  }

  console.log("BEFORE ADD DOC");

  await addDoc(collection(db, "expenses"), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value,
    createdAt: new Date(),
  });

  console.log("AFTER ADD DOC");

  router.push("/tabs/tab1");
};
</script>
