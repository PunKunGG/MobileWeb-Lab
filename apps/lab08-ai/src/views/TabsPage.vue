<template>
  <ion-tabs>
    <ion-router-outlet></ion-router-outlet>

    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="tab1" href="/tabs/tab1">
        <ion-label>Analyze</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="tab2" href="/tabs/tab2">
        <ion-label>History</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="tab3" href="/tabs/tab3">
        <ion-label>About</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/vue";
</script>
