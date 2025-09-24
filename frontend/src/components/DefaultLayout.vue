<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowUpTrayIcon,
  FolderIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { RouterLink, RouterView } from "vue-router";
import axiosClient from "../axios";
import router from "../router";
import useUserStore from "../store/user";
import { computed, ref } from "vue";
import type { User } from "../types/User";

import Logo from "../assets/logo.png";
import AudioPlayer from "./AudioPlayer.vue";

const userStore = useUserStore();
const user = computed<User | null>(() => userStore.user);

const search = ref<string>("");

const navigation = [
  { name: "Home", to: { name: "Home" } },
  { name: "My Tracks", to: { name: "Tracks" } },
  { name: "Upload", to: { name: "Upload" } },
];

const guestNavigation = [
  { name: "Login", to: { name: "Login" } },
  { name: "Sign Up", to: { name: "Signup" } },
];

function logout() {
  axiosClient
    .post("/logout")
    .then((response) => {
      userStore.user = null;
      router.push({ name: "" });
      console.log("Logged out successfully");
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
}

async function searchTracks() {
  try {
    router.push({
      name: "Search",
      query: { q: !search.value ? "" : search.value },
    });
    console.log("Search button pressed");
    console.log("Search results", search.value);
  } catch (error) {}
}
</script>

<template>
  <div class="min-h-full">
    <header class="py-4 px-4 sm:px-6 lg:px-8 sticky font-medium">
      <div class="flex justify-between items-center">
        <div
          class="flex items-center gap-3 hover:cursor-pointer"
          @click="router.push({ name: 'Home' })"
        >
          <img class="size-8" :src="Logo" alt="Your Company" />

          <p class="text-xl font-semibold">Tracknest</p>
        </div>
        <div class="flex flex-1 justify-center gap-2" v-if="user">
          <input
            v-model="search"
            type="text"
            placeholder="Search tracks"
            class="w-full max-w-md px-4 py-2 text-sm rounded-l-xl border border-neutral-600 placeholder:text-neutral-400 transition-all duration-300 focus:w-full focus:max-w-lg focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 hover:border-gray-400 outline-none"
          />
          <button
            @click="searchTracks()"
            class="rounded-r-lg p-2 w-10 bh-10 bg-neutral-700 text-neutral-950 flex items-center justify-center gap-1 text-xs font-semibold hover:bg-neutral-300 hover:cursor-pointer transition-all"
          >
            <MagnifyingGlassIcon class="h-4 w-4 text-white" />
          </button>
        </div>

        <nav class="flex items-center gap-3 justify-between text-sm">
          <!-- Authenticated Navigation -->
          <div class="flex" v-if="user">
            <button
              @click="router.push({ name: 'Upload' })"
              class="p-3 hover:bg-neutral-800 hover:cursor-pointer rounded-xl flex items-center gap-2 transition-all"
            >
              <!-- <ArrowUpTrayIcon class="h-5 w-5" /> -->
              Upload
            </button>
            <button
              @click="router.push({ name: 'Tracks' })"
              class="p-3 hover:bg-neutral-800 hover:cursor-pointer rounded-xl flex items-center gap-2 transition-all"
            >
              <!-- <FolderIcon class="h-5 w-5" /> -->
              My Tracks
            </button>

            <img
              :src="user?.profile?.imageUrl"
              class="h-10 w-10 bg-amber-200 rounded-full"
            />
          </div>
          <!-- Unauthenticated Navigation -->
          <div class="flex" v-if="!user">
            <button
              @click="router.push({ name: 'Login' })"
              class="p-3 hover:bg-neutral-800 hover:cursor-pointer rounded-xl flex items-center gap-2 transition-all"
            >
              <!-- <ArrowUpTrayIcon class="h-5 w-5" /> -->
              Login
            </button>
            <button
              @click="router.push({ name: 'Signup' })"
              class="p-3 hover:bg-neutral-800 hover:cursor-pointer rounded-xl flex items-center gap-2 transition-all"
            >
              <!-- <FolderIcon class="h-5 w-5" /> -->
              Sign Up
            </button>
          </div>
        </nav>
      </div>
    </header>
    <!-- Left Sidebar -->

    <!-- Content -->
    <div class="flex">
      <div class="flex sticky p-8">
        <div>
          <p class="font-semibold">My Followings</p>
          <p>sdfsdf</p>
        </div>
      </div>
      <main class="flex-grow">
        <div
          class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 sm:py-10 lg:py-12 flex-grow"
        >
          <RouterView :key="$route.fullPath" />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
