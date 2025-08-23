import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "./components/DefaultLayout.vue";
//import ProfilePage from "./pages/ProfilePage.vue";
import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import SignupPage from "./pages/SignupPage.vue";
import TracksPage from "./pages/TracksPage.vue";
import NotFound from "./components/NotFound.vue";
import UploadPage from "./pages/UploadPage.vue";
import useUserStore from "./store/user";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "/", name: "Home", component: HomePage },
      { path: "/upload", name: "Upload", component: UploadPage },
      {
        path: "/tracks",
        name: "Tracks",
        component: TracksPage,
      },
    ],
    beforeEnter: async (to: any, from: any, next: any) => {
      // Authentication check
      try {
        const userStore = useUserStore();
        await userStore.fetchUser();
        next();
      } catch {
        console.error("User not authenticated or error fetching user data");
        // Redirect to login if user is not authenticated
        next(false);
      }
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupPage,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
