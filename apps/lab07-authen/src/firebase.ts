import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJIPTezlj2-SmcsT1xEzlj9d0QbAYY0N0",
  authDomain: "lab07-authen-6633800265.firebaseapp.com",
  projectId: "lab07-authen-6633800265",
  appId: "1:25202031854:web:01a100094d5e0b18efc7ff",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
