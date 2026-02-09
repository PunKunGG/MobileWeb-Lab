<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>ยินดีต้อนรับ 👋</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <p v-if="user">
            คุณล็อกอินด้วยอีเมล: <b>{{ user.email }}</b>
          </p>
          <p v-else>ยังไม่ได้เข้าสู่ระบบ</p>

          <ion-button expand="block" router-link="/tabs/profile">
            ไปที่หน้าโปรไฟล์
          </ion-button>
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
  IonButton,
} from "@ionic/vue";

import { ref, onMounted } from "vue";
import { auth } from "@/firebase";

const user = ref<any>(null);

onMounted(() => {
  user.value = auth.currentUser;
});
</script>
