import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "./components/DefaultLayout.vue";
import ProfilePage from "./pages/ProfilePage.vue";
import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import SignupPage from "./pages/SignupPage.vue";
import TracksPage from "./pages/TracksPage.vue";
import NotFound from "./components/NotFound.vue";
import UploadPage from "./pages/UploadPage.vue";
import useUserStore from "./store/user";
import GuestPage from "./pages/GuestPage.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "/",
        name: "Guest",
        component: GuestPage,
        meta: { requiresAuth: false },
      },
      {
        path: "/home",
        name: "Home",
        component: HomePage,
        meta: { requiresAuth: true },
      },
      {
        path: "/upload",
        name: "Upload",
        component: UploadPage,
        meta: { requiresAuth: true },
      },
      {
        path: "/tracks",
        name: "Tracks",
        component: TracksPage,
        meta: { requiresAuth: true },
      },
      { path: "/profile", name: "Profile", component: ProfilePage },
    ],
    // beforeEnter: async (to: any, from: any, next: any) => {
    //   // Authentication check
    //   try {
    //     const userStore = useUserStore();
    //     await userStore.fetchUser();
    //     next();
    //   } catch {
    //     console.error("User not authenticated or error fetching user data");
    //     // Redirect to login if user is not authenticated
    //     next(false);
    //   }
    // },
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

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // Fetch user only if not already loaded
  if (!userStore.user) {
    try {
      await userStore.fetchUser();
    } catch {
      // If fetch fails, user stays null
      userStore.user = null;
    }
  }

  const isAuthenticated = !!userStore.user;

  // Redirect logged-in users away from auth pages
  if (
    isAuthenticated &&
    (to.name === "Login" || to.name === "Signup" || to.name === "Guest")
  ) {
    return next({ name: "Home" });
  }

  // Protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "Login" });
  }

  return next();
});

export default router;
