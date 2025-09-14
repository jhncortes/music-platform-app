<script setup lang="ts">
import { PhotoIcon, MusicalNoteIcon } from "@heroicons/vue/24/solid";
import type { TrackData } from "../types/Track";
import { computed, ref } from "vue";
import axiosClient from "../axios";
import router from "../router";
import axios from "axios";
import useUserStore from "../store/user";
import type { User } from "../types/User";
import { putToS3 } from "../services/s3";

const userStore = useUserStore();
const user = computed<User | null>(() => userStore.user);

const isAudioUploaded = ref(false);

const isImageDragging = ref(false);
const isAudioDragging = ref(false);

function handleImageDragEnter(event: DragEvent) {
  event.preventDefault();
  isImageDragging.value = !isImageDragging.value;
}

function handleAudioDragEnter(event: DragEvent) {
  event.preventDefault();
  isAudioDragging.value = !isAudioDragging.value;
}

function handleImageDrop(event: DragEvent) {
  event.preventDefault();
  isImageDragging.value = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    if (files) trackData.value.image = files[0];
  }
}

function handleAudioDrop(event: DragEvent) {
  event.preventDefault();
  isAudioDragging.value = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    if (files) trackData.value.audio = files[0];
  }
}

const trackData = ref<TrackData>({
  image: null,
  audio: null,
  title: "",
  description: "",
  genre: "",
});

async function submit() {
  try {
    console.log("Form submitted with data:", trackData.value);
    if (
      !trackData.value.image ||
      !trackData.value.audio ||
      !user.value ||
      user.value === null
    ) {
      throw new Error("Missing image, audio or user ID");
    }

    const formData = new FormData();
    formData.append("userId", user.value.id);
    formData.append("image", trackData.value.image);
    formData.append("audio", trackData.value.audio);
    formData.append("title", trackData.value.title);
    formData.append("description", trackData.value.description);
    formData.append("genre", trackData.value.genre);
    // Send track metadata to backend
    const response = await axiosClient.post("/api/tracks", formData);
    console.log("Presigned URL received:", response.data);

    // Upload image and audio to S3
    console.log("Uploading files to S3");
    await putToS3(response.data.imagePresignedUrl, trackData.value.image);
    await putToS3(response.data.audioPresignedUrl, trackData.value.audio);

    // Reset form
    trackData.value = {
      image: null,
      audio: null,
      title: "",
      description: "",
      genre: "",
    };
    // Redirect to tracks page
    router.push({ name: "Tracks" });
    console.log("Successfully uploaded!");
  } catch (error) {
    console.error("Error preparing upload:", error);
  }
}
</script>

<template>
  <header>
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight">Upload a Track</h1>
      <p>Upload a track in WAV, MP3, OGG format</p>
    </div>
  </header>

  <form @submit.prevent="submit" class="p-8">
    <div class="col-span-full mb-4">
      <label class="block text-sm/6 font-medium text-white">Audio file</label>
    </div>
    <!-- Audio File Dropzone -->
    <div
      @dragenter.prevent="handleAudioDragEnter"
      @dragleave.prevent="handleAudioDragEnter"
      @dragover.prevent
      @drop.prevent="handleAudioDrop"
      :class="[
        'mt-2 mb-4 flex justify-center rounded-lg border border-dashed px-6 py-10',
        isAudioDragging
          ? 'border-white bg-neutral-700 transition-colors'
          : 'border-white/25 transition-colors',
      ]"
    >
      <div class="text-center">
        <MusicalNoteIcon
          class="mx-auto size-12 text-gray-200"
          aria-hidden="true"
        />
        <div class="mt-4 flex text-sm/6 text-gray-400">
          <label
            class="relative cursor-pointer rounded-md font-semibold text-sky-400 hover:text-sky-300"
            for="audio-upload"
          >
            Upload File
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>

        <p class="text-xs/5 text-gray-400">
          {{
            trackData.audio ? trackData.audio.name : "PNG, JPG, GIF up to 10MB"
          }}
        </p>
      </div>
      <input
        @change="
          trackData.audio =
            ($event.target as HTMLInputElement).files?.[0] ?? null
        "
        id="audio-upload"
        type="file"
        class="sr-only"
      />
    </div>

    <div class="grid grid-cols-2 gap-6 items-stretch">
      <div class="flex flex-col">
        <!-- Image File Dropzone -->
        <div
          @dragenter.prevent="handleImageDragEnter"
          @dragleave.prevent="handleImageDragEnter"
          @dragover.prevent
          @drop.prevent="handleImageDrop"
          :class="[
            'mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 h-full',
            isImageDragging
              ? 'border-white bg-neutral-700 transition-colors'
              : 'border-white/25 transition-colors',
          ]"
        >
          <div class="text-center">
            <PhotoIcon
              class="mx-auto size-12 text-gray-200"
              aria-hidden="true"
            />
            <div class="mt-4 flex text-sm/6 text-gray-400">
              <label
                class="relative cursor-pointer rounded-md font-semibold text-sky-400 hover:text-sky-300"
                for="image-upload"
              >
                Upload File
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>

            <p class="text-xs/5 text-gray-400">
              {{
                trackData.image
                  ? trackData.image.name
                  : "PNG, JPG, GIF up to 10MB"
              }}
            </p>
          </div>
          <input
            @change="
              trackData.image =
                ($event.target as HTMLInputElement).files?.[0] ?? null
            "
            id="image-upload"
            type="file"
            class="sr-only"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <!-- Title -->
        <label for="title" class="block text-sm/6 font-medium text-white"
          >Title</label
        >
        <div class="mt-2 mb-4">
          <input
            v-model="trackData.title"
            type="text"
            name="title"
            id="title"
            class="block w-full flex-1 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
        <!-- Description -->
        <label for="description" class="block text-sm/6 font-medium text-white"
          >Description</label
        >
        <div class="mt-2 mb-4">
          <input
            v-model="trackData.description"
            type="text"
            name="description"
            id="description"
            class="block w-full flex-1 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
        <!-- Genre -->
        <label for="genre" class="block text-sm/6 font-medium text-white"
          >Genre</label
        >
        <div class="mt-2">
          <input
            v-model="trackData.genre"
            type="text"
            name="genre"
            id="genre"
            class="block w-full flex-1 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
      </div>
    </div>

    <button
      type="submit"
      class="mt-4 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 w-full"
    >
      Upload Track
    </button>
  </form>
</template>

<style scoped></style>
