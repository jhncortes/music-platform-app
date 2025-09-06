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
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { RouterLink, RouterView } from "vue-router";
import axiosClient from "../axios";
import router from "../router";
import useUserStore from "../store/user";
import { computed } from "vue";
import type { User } from "../types/User";

import Logo from "../assets/logo.png";
const userStore = useUserStore();

const user = computed<User | null>(() => userStore.user);

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
      router.push({ name: "Home" });
      console.log("Logged out successfully");
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
}
</script>

<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-gray-900">
    <body class="h-full">
    ```
  -->
  <div class="min-h-full">
    <Disclosure as="nav" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="shrink-0 flex items-center space-x-2">
              <img class="size-8" :src="Logo" alt="Your Company" />
              <p class="font-bold text-lg">Tracknest</p>
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <RouterLink
                  v-for="item in user ? navigation : guestNavigation"
                  :key="item.name"
                  :to="item.to"
                  :class="[
                    $route.name === item.to.name
                      ? 'bg-gray-950/50 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium',
                  ]"
                  :aria-current="
                    $route.name === item.to.name ? 'page' : undefined
                  "
                  >{{ item.name }}</RouterLink
                >
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <!-- Profile dropdown -->
              <Menu as="div" class="relative ml-3">
                <MenuButton
                  class="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">Open user menu</span>
                  <img
                    class="size-8 rounded-full outline -outline-offset-1 outline-white/10"
                    src="https://randomuser.me/api/portraits/women/15.jpg"
                    alt=""
                  />
                  <span class="ml-3">{{ user?.name }}</span>
                </MenuButton>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline-1 -outline-offset-1 outline-white/10"
                  >
                    <MenuItem>
                      <button
                        @click="
                          router.push({
                            name: 'UserProfile',
                            params: { username: user?.username },
                          })
                        "
                        :class="['block px-4 py-2 text-sm text-gray-300']"
                      >
                        My Profile
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        @click="router.push({ name: 'Settings' })"
                        :class="['block px-4 py-2 text-sm text-gray-300']"
                      >
                        Settings
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        @click="logout"
                        :class="['block px-4 py-2 text-sm text-gray-300']"
                      >
                        Sign Out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
          <div class="-mr-2 flex md:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
              <XMarkIcon v-else class="block size-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="md:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            :class="[
              $route.name === item.to.name
                ? 'bg-gray-950/50 text-white'
                : 'text-gray-300 hover:bg-white/5 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium',
            ]"
            :aria-current="$route.name === item.to.name ? 'page' : undefined"
            >{{ item.name }}</RouterLink
          >
        </div>
        <div class="border-t border-white/10 pt-4 pb-3">
          <div class="flex items-center px-5">
            <div class="shrink-0">
              <img
                class="size-10 rounded-full outline -outline-offset-1 outline-white/10"
                :src="user?.imageUrl"
                alt=""
              />
            </div>
            <div class="ml-3">
              <div class="text-base/5 font-medium text-white">
                {{ user?.name }}
              </div>
              <div class="text-sm font-medium text-gray-400">
                {{ user?.email }}
              </div>
            </div>
          </div>
          <div class="mt-3 space-y-1 px-2">
            <DisclosurePanel
              @click="logout"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
              >Sign Out</DisclosurePanel
            >
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <main>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <!-- Your content -->
        <RouterView />
        <!-- Shows guest page if not logged in and on home route -->
      </div>
    </main>
  </div>
</template>

<style scoped></style>
