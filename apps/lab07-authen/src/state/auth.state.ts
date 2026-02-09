import { ref } from "vue";
import type { IUser } from "@/interfaces/user.interface";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

export const currentUser = ref<IUser | null>(null);

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser.value = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } else {
    currentUser.value = null;
  }
});
