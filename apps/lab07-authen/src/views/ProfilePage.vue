<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card v-if="user">
        <ion-card-header>
          <ion-card-title>{{ user.displayName || "No Name" }}</ion-card-title>
          <ion-card-subtitle>{{
            user.email || user.phoneNumber
          }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <p><b>UID:</b> {{ user.uid }}</p>
          <ion-button expand="block" color="danger" @click="handleLogout">
            Logout
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { logout } from "@/services/auth.service";
import { useRouter } from "vue-router";

const user = ref<any>(null);
const router = useRouter();

onMounted(() => {
  user.value = auth.currentUser;
});

const handleLogout = async () => {
  await logout();
  router.replace("/login");
};
</script>
