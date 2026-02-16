<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>History</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card v-for="(item, i) in history" :key="i">
        <ion-card-header>
          <ion-card-title>{{ item.title }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>{{ item.description }}</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";

const history = ref([
  { title: "dog.png", description: "Golden retriever puppy on grass" },
  { title: "cat.jpg", description: "Cat sitting on a sofa" },
]);
</script>
