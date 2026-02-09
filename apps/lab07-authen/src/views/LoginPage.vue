<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input
        label="Email"
        label-placement="stacked"
        type="email"
        :value="email"
        placeholder="you@example.com"
        @ionInput="onEmailInput"
      />

      <ion-input
        label="Password"
        label-placement="stacked"
        type="password"
        :value="password"
        placeholder="******"
        @ionInput="onPasswordInput"
      />

      <ion-input
        label="Phone (+66...)"
        label-placement="stacked"
        v-model:value="phone"
        placeholder="+66812345678"
      />

      <div id="recaptcha-container" style="margin: 16px 0"></div>

      <ion-button expand="block" color="secondary" @click="sendOTP">
        Send OTP
      </ion-button>

      <ion-input
        label="OTP"
        label-placement="stacked"
        v-model:value="otp"
        placeholder="123456"
      />

      <ion-button expand="block" color="tertiary" @click="confirmOTP">
        Confirm OTP
      </ion-button>

      <ion-button expand="block" @click="loginEmail"> Login </ion-button>

      <ion-button expand="block" color="danger" @click="loginGoogle">
        Login with Google
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
} from "@ionic/vue";

import { loginWithEmail, loginWithGoogle } from "@/services/auth.service";
import { setupRecaptcha, loginWithPhone } from "@/services/auth.service";
import type { ConfirmationResult } from "firebase/auth";

const phone = ref("");
const otp = ref("");
let confirmationResult: ConfirmationResult | null = null;
let recaptcha: any = null;

const sendOTP = async () => {
  try {
    recaptcha = setupRecaptcha("recaptcha-container");
    confirmationResult = await loginWithPhone(phone.value, recaptcha);
    alert("OTP sent!");
  } catch (err: any) {
    alert(err.message);
  }
};

const confirmOTP = async () => {
  try {
    if (!confirmationResult) return alert("กรุณากด Send OTP ก่อน");
    await confirmationResult.confirm(otp.value);
    router.push("/tabs/tab1");
  } catch (err: any) {
    alert("OTP ไม่ถูกต้อง");
  }
};

const router = useRouter();

const email = ref("");
const password = ref("");

// 👇 handler สำหรับ ion-input
const onEmailInput = (ev: any) => {
  email.value = ev.detail.value ?? "";
};

const onPasswordInput = (ev: any) => {
  password.value = ev.detail.value ?? "";
};

const loginEmail = async () => {
  console.log("EMAIL =", email.value);
  console.log("PASSWORD =", password.value);

  if (!email.value || !password.value) {
    alert("กรุณากรอก Email และ Password");
    return;
  }

  try {
    await loginWithEmail(email.value, password.value);
    router.push("/tabs/tab1");
  } catch (err: any) {
    alert(err.message);
  }
};

const loginGoogle = async () => {
  try {
    await loginWithGoogle();
    router.push("/tabs/tab1");
  } catch (err: any) {
    alert(err.message);
  }
};
</script>
