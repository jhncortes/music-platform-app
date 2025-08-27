<script setup lang="ts">
import { RouterLink } from "vue-router";
import heroImage from "../assets/hero.png";
</script>

<template>
  <div class="pt-20 px-4">
    <div>
      <h1 class="text-9xl font-bold">Music Sharing Made Simple</h1>
      <p class="mt-6 text-2xl max-w-2xl mb-8">
        Easily upload your tracks, grow your audience, and discover new sounds
        from artists around the world.
      </p>

      <RouterLink
        :to="{ name: 'Signup' }"
        class="rounded-full bg-sky-600 px-6 py-3 text-lg font-semibold hover:text-white hover:bg-sky-800 hover:shadow-lg transition text-center"
      >
        Share Your Music Now
      </RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
