<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input label="ชื่อรายการ" label-placement="stacked" v-model="title" />

      <ion-input
        label="จำนวนเงิน"
        label-placement="stacked"
        type="number"
        v-model="amount"
      />

      <ion-select label="ประเภท" label-placement="stacked" v-model="type">
        <ion-select-option value="income">รายรับ</ion-select-option>
        <ion-select-option value="expense">รายจ่าย</ion-select-option>
      </ion-select>

      <ion-input
        label="หมวดหมู่"
        label-placement="stacked"
        v-model="category"
      />

      <ion-textarea label="หมายเหตุ" label-placement="stacked" v-model="note" />

      <ion-button expand="block" class="ion-margin-top" @click="updateExpense">
        บันทึกการแก้ไข
      </ion-button>

      <ion-button
        expand="block"
        fill="outline"
        color="medium"
        class="ion-margin-top"
        @click="goBack"
      >
        กลับ
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

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const title = ref("");
const amount = ref("");
const type = ref("expense");
const category = ref("");
const note = ref("");

onMounted(async () => {
  const snap = await getDoc(doc(db, "expenses", id));
  if (snap.exists()) {
    const data = snap.data();
    title.value = data.title;
    amount.value = String(data.amount);
    type.value = data.type;
    category.value = data.category;
    note.value = data.note;
  }
});

const updateExpense = async () => {
  await updateDoc(doc(db, "expenses", id), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value,
  });

  router.push("/tabs/tab1");
};

const goBack = () => {
  router.push("/tabs/tab1");
};
</script>
