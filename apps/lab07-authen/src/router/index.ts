import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/",
    redirect: "/tabs/tab1",
  },
  {
    path: "/tabs",
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: "tab1",
        component: () => import("@/views/Tab1Page.vue"),
      },
      {
        path: "tab2",
        component: () => import("@/views/Tab2Page.vue"),
      },
      {
        path: "tab3",
        component: () => import("@/views/ProfilePage.vue"),
      },
      {
        path: "profile",
        component: ProfilePage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// ป้องกัน redirect ตอน auth ยังโหลดไม่เสร็จ
let authReady = false;

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!authReady) {
    onAuthStateChanged(auth, (user) => {
      authReady = true;
      if (requiresAuth && !user) {
        next("/login");
      } else {
        next();
      }
    });
  } else {
    const user = auth.currentUser;
    if (requiresAuth && !user) {
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
