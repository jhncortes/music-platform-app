<script setup lang="ts">
import { PhotoIcon } from "@heroicons/vue/24/solid";
</script>

<template>
  <div class="col-span-full mb-4">
    <label for="cover-photo" class="block text-sm/6 font-medium text-white"
      >Cover photo</label
    >
    <div
      class="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10"
    >
      <div class="text-center">
        <PhotoIcon class="mx-auto size-12 text-gray-200" aria-hidden="true" />
        <div class="mt-4 flex text-sm/6 text-gray-400">
          <label
            for="file-upload"
            class="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
          >
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              class="sr-only"
            />
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>
        <p class="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  </div>
  <div class="sm:col-span-3 mb-4">
    <label for="description" class="block text-sm/6 font-medium text-white"
      >Description</label
    >
    <div class="mt-2">
      <input
        type="text"
        name="description"
        id="description"
        class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
      />
    </div>
  </div>
  <button
    type="submit"
    class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
  >
    Upload
  </button>
</template>

<style scoped></style>
