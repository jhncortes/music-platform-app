// import { createRouter, createWebHistory } from "vue-router";
// import DefaultLayout from "./components/DefaultLayout.vue";
// import ProfilePage from "./pages/ProfilePage.vue";
// import HomePage from "./pages/HomePage.vue";
// import LoginPage from "./pages/LoginPage.vue";
// import SignupPage from "./pages/SignupPage.vue";
// import TracksPage from "./pages/TracksPage.vue";
// import NotFound from "./components/NotFound.vue";
// import UploadPage from "./pages/UploadPage.vue";
// import useUserStore from "./store/user";
// import GuestPage from "./pages/GuestPage.vue";
// import axiosClient from "./axios";
// import useUserProfileStore from "./store/userProfile";
// import { useTrackStore } from "./store/track";
// import SettingsPage from "./pages/SettingsPage.vue";
// import TrackInfoPage from "./pages/TrackInfoPage.vue";

// const routes = [
//   {
//     path: "/",
//     component: DefaultLayout,

//     children: [
//       {
//         path: "/:username",
//         name: "UserProfile",
//         component: ProfilePage,
//         meta: { requiresAuth: false },

//         beforeEnter: async (to: any, from: any, next: any) => {
//           try {
//             const userProfileStore = useUserProfileStore();
//             //const trackStore = useTrackStore();
//             // try fetching user by username
//             console.log("Username parameter:", to.params.username);
//             // get user profile data
//             const profileData = await userProfileStore.fetchProfile(
//               to.params.username
//             );
//             // get tracks from a user
//             //await trackStore.fetchTracks(profileData.id);
//             next(); // continue
//           } catch (e) {
//             console.error("Error fetching profile:", e);
//             return next({ name: "NotFound" });
//           }
//         },
//       },
//       {
//         path: "/track/:trackId",
//         name: "TrackInfo",
//         component: TrackInfoPage,
//         meta: { requiresAuth: false },

//         beforeEnter: async (to: any, from: any, next: any) => {
//           try {
//             const trackStore = useTrackStore();
//             const viewedTrack = await trackStore.fetchTrackbyId(
//               to.params.trackId
//             );

//             next(); // continue
//           } catch (e) {
//             console.error("Error fetching profile:", e);
//             return next({ name: "NotFound" });
//           }
//         },
//       },

//       {
//         path: "/",
//         name: "Guest",
//         component: GuestPage,
//         meta: { requiresAuth: false },
//       },

//       {
//         path: "/home",
//         name: "Home",
//         component: HomePage,
//         meta: { requiresAuth: true },
//       },
//       {
//         path: "/upload",
//         name: "Upload",
//         component: UploadPage,
//         meta: { requiresAuth: true },
//       },
//       {
//         path: "/tracks",
//         name: "Tracks",
//         component: TracksPage,
//         meta: { requiresAuth: true },
//       },

//       {
//         path: "/settings",
//         name: "Settings",
//         component: SettingsPage,
//         meta: { requiresAuth: true },
//       },
//       // { path: "/profile", name: "Profile", component: ProfilePage },
//     ],
//     // beforeEnter: async (to: any, from: any, next: any) => {
//     //   // Authentication check
//     //   try {
//     //     const userStore = useUserStore();
//     //     await userStore.fetchUser();
//     //     next();
//     //   } catch {
//     //     console.error("User not authenticated or error fetching user data");
//     //     // Redirect to login if user is not authenticated
//     //     next(false);
//     //   }
//     // },
//   },
//   {
//     path: "/login",
//     name: "Login",
//     component: LoginPage,
//   },
//   {
//     path: "/signup",
//     name: "Signup",
//     component: SignupPage,
//   },
//   {
//     path: "/:pathMatch(.*)*",
//     name: "NotFound",
//     component: NotFound,
//   },
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// router.beforeEach(async (to, from, next) => {
//   const userStore = useUserStore();

//   // Fetch user only if not already loaded
//   if (!userStore.user) {
//     try {
//       await userStore.fetchUser();
//     } catch {
//       // If fetch fails, user stays null
//       userStore.user = null;
//     }
//   }

//   const isAuthenticated = !!userStore.user;

//   // Redirect logged-in users away from auth pages
//   if (
//     isAuthenticated &&
//     (to.name === "Login" || to.name === "Signup" || to.name === "Guest")
//   ) {
//     return next({ name: "Home" });
//   }

//   // Protected routes
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     return next({ name: "Login" });
//   }

//   return next();
// });

// export default router;

import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "./components/DefaultLayout.vue";
import ProfilePage from "./pages/ProfilePage.vue";
import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import SignupPage from "./pages/SignupPage.vue";
import TracksPage from "./pages/TracksPage.vue";
import NotFound from "./components/NotFound.vue";
import UploadPage from "./pages/UploadPage.vue";
import GuestPage from "./pages/GuestPage.vue";
import useUserStore from "./store/user";
import useUserProfileStore from "./store/userProfile";
import { useTrackStore } from "./store/track";
import SettingsPage from "./pages/SettingsPage.vue";
import TrackInfoPage from "./pages/TrackInfoPage.vue";
import SearchPage from "./pages/SearchPage.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "Guest",
        component: GuestPage,
        meta: { requiresAuth: false },
      },
      {
        path: ":username",
        name: "UserProfile",
        component: ProfilePage,
        meta: { requiresAuth: false },
        beforeEnter: async (to: any, from: any, next: any) => {
          try {
            const userProfileStore = useUserProfileStore();
            if (
              !userProfileStore ||
              userProfileStore.userProfile?.username !== to.params.username
            ) {
              await userProfileStore.fetchProfile(to.params.username);
            }
            next();
          } catch (e) {
            console.error("Error fetching user profile:", e);
            next({ name: "NotFound" });
          }
        },
      },
      {
        path: "track/:trackId",
        name: "TrackInfo",
        component: TrackInfoPage,
        meta: { requiresAuth: false },
        beforeEnter: async (to: any, from: any, next: any) => {
          try {
            const trackStore = useTrackStore();
            if (
              !trackStore.currentTrack ||
              trackStore.currentTrack.id !== to.params.trackId
            ) {
              await trackStore.fetchTrackbyId(to.params.trackId);
            }
            next();
          } catch (e) {
            console.error("Error fetching track:", e);
            next({ name: "NotFound" });
          }
        },
      },
      {
        path: "home",
        name: "Home",
        component: HomePage,
        meta: { requiresAuth: true },
      },
      {
        path: "search",
        name: "Search",
        component: SearchPage,
        meta: { requiresAuth: true },
      },

      {
        path: "upload",
        name: "Upload",
        component: UploadPage,
        meta: { requiresAuth: true },
      },
      {
        path: "tracks",
        name: "Tracks",
        component: TracksPage,
        meta: { requiresAuth: true },
      },
      {
        path: "settings",
        name: "Settings",
        component: SettingsPage,
        meta: { requiresAuth: true },
      },
    ],
  },

  // Auth & public routes
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/signup", name: "Signup", component: SignupPage },

  // Not found
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (!userStore.user) {
    try {
      await userStore.fetchUser();
    } catch {
      userStore.user = null;
    }
  }

  const isAuthenticated = !!userStore.user;

  // If logged in and going to "/" (Guest) → redirect to /home
  if (isAuthenticated && to.name === "Guest") {
    return next({ name: "Home" });
  }

  // If logged in, block login/signup
  if (isAuthenticated && ["Login", "Signup"].includes(to.name as string)) {
    return next({ name: "Home" });
  }

  // If route requires auth but not logged in → redirect
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "Login" });
  }

  return next();
});

export default router;
