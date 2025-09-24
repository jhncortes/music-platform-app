<script setup lang="ts">
import { computed } from "vue";
import AudioPlayer from "./components/AudioPlayer.vue";
import useUserStore from "./store/user";

const userStore = useUserStore();
const user = computed(() => userStore.user);
</script>

<template>
  <AudioPlayer v-if="user" />
  <RouterView />
</template>

<style scoped></style>
