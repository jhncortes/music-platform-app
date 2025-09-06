<script setup lang="ts">
import { computed, ref } from "vue";
import useUserStore from "../store/user";
import type { User } from "../types/User";
import type { Track } from "../types/Track";

const tracks = ref<Track[]>([]);
const userStore = useUserStore();
const user = computed<User | null>(() => userStore.user);
</script>

<template>
  <header>
    <div class="mx-auto max-w-7xl px-4 py-4">
      <h1 class="text-4xl font-bold tracking-tight">Settings</h1>
      <p>Customize your experience</p>
    </div>
  </header>
  <main>
    <div class="mt-10 mx-auto px-4">
      <form @submit.prevent="" class="space-y-6">
        <div>
          <label
            for="username"
            class="block text-sm/6 font-medium text-gray-100"
            >Username</label
          >
          <div class="mt-2">
            <input
              id="username"
              type="username"
              name="username"
              required
              autocomplete="username"
              class="block max-w-xs w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label
            for="biography"
            class="block text-sm/6 font-medium text-gray-100"
            >Biography</label
          >
          <div class="mt-2">
            <input
              id="biography"
              type="biography"
              name="biography"
              required
              autocomplete="biography"
              class="block max-w-xs w-full h-20 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped></style>
