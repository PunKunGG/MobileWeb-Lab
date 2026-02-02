<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการทั้งหมด</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- LIST -->
      <ion-list v-if="expenses.length">
        <ion-item-sliding v-for="item in expenses" :key="item.id">
          <!-- ✅ กด item = ไปหน้าแก้ไข -->
          <ion-item button @click="goToEdit(item.id)">
            <ion-label>
              <h2>
                {{ item.title }}
                <ion-badge
                  :color="item.type === 'income' ? 'success' : 'danger'"
                  class="ion-margin-start"
                >
                  {{ item.type === "income" ? "รายรับ" : "รายจ่าย" }}
                </ion-badge>
              </h2>

              <p>หมวดหมู่: {{ item.category || "-" }}</p>
              <p>หมายเหตุ: {{ item.note || "-" }}</p>
            </ion-label>

            <ion-text slot="end" color="primary">
              {{ item.amount }} บาท
            </ion-text>
          </ion-item>

          <!-- SLIDE DELETE -->
          <ion-item-options side="end">
            <ion-item-option
              color="danger"
              @click.stop="deleteExpense(item.id)"
            >
              ลบ
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- EMPTY -->
      <ion-text v-else color="medium"> ยังไม่มีรายการ </ion-text>

      <!-- FAB ADD -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button color="primary" @click="goToAdd"> + </ion-fab-button>
      </ion-fab>
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
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonBadge,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonFab,
  IonFabButton,
} from "@ionic/vue";

import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

type Expense = {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  note: string;
};

const router = useRouter();
const expenses = ref<Expense[]>([]);
let unsubscribe: (() => void) | null = null;

/* =========================
   Navigation
========================= */
const goToAdd = () => {
  router.push("/add");
};

const goToEdit = (id: string) => {
  router.push(`/edit/${id}`);
};

/* =========================
   Delete
========================= */
const deleteExpense = async (id: string) => {
  if (!confirm("ต้องการลบรายการนี้หรือไม่?")) return;
  await deleteDoc(doc(db, "expenses", id));
};

/* =========================
   Realtime Read
========================= */
onMounted(() => {
  const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

  unsubscribe = onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Expense, "id">),
    }));
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
