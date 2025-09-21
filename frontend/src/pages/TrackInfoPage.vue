<script setup lang="ts">
import { computed, ref } from "vue";
import type { Track } from "../types/Track";
import useUserStore from "../store/user";
import type { User } from "../types/User";
import { useTrackStore } from "../store/track";
import { timeAgoIntl } from "../utils/time";
import {
  HeartIcon,
  UserPlusIcon,
  PaperAirplaneIcon,
  ChatBubbleBottomCenterIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from "@heroicons/vue/24/solid";
import router from "../router";
import { useCommentStore } from "../store/comment";
import type { Comment } from "../types/Comment";
import axiosClient from "../axios";

//const tracks = ref<Track[]>([]);
const userStore = useUserStore();
const trackStore = useTrackStore();
const commentStore = useCommentStore();

const user = computed<User | null>(() => userStore.user);
const viewedTrack = computed<Track | null>(() => trackStore.viewedTrack);
const comments = computed<Comment[]>(() => commentStore.comments);
const isPlaying = computed(
  () =>
    trackStore.isPlaying &&
    trackStore.currentTrack?.id === viewedTrack.value?.id
);

function togglePlay() {
  trackStore.setCurrentTrack({
    id: viewedTrack.value?.id,
    creatorId: viewedTrack.value?.creatorId,
    creator: viewedTrack.value?.creator,
    title: viewedTrack.value?.title,
    imageUrl: viewedTrack.value?.imageUrl,
    audioUrl: viewedTrack.value?.audioUrl,
    genre: viewedTrack.value?.genre,
    description: viewedTrack.value?.description,
    createdAt: viewedTrack.value?.createdAt,
    updatedAt: viewedTrack.value?.updatedAt,
  });
}

async function postComment() {
  try {
    if (!commentInputData.value || !user.value || !viewedTrack.value) {
      throw Error;
    }

    const formData = new FormData();
    formData.append("userId", String(user.value?.id));
    formData.append("trackId", String(viewedTrack.value?.id));
    formData.append("comment", commentInputData.value.comment);

    const response = await axiosClient.post("/api/comment", formData);

    // Append locally
    const newComment: Comment = {
      id: Date.now(), // temporary ID
      userId: user.value.id,
      trackId: viewedTrack.value.id,
      comment: commentInputData.value.comment,
      createdAt: new Date().toISOString(),
      user: {
        ...user.value,
        profile: {
          id: user.value.id,
          username: user.value.username,
          name: user.value.name,
          imageUrl: user.value.imageUrl,
        },
      },
    };
    commentStore.comments.unshift(newComment);

    // Clear input
    commentInputData.value.comment = "";

    console.log("Successfully posted comment:", response);
  } catch (error) {
    console.error("Error posting comment:", error);
  }
}

const commentInputData = ref({
  comment: "",
});

// function deleteTrack(trackId: number) {
//   if (!confirm("Are you sure you want to delete this track?")) {
//     return;
//   }
//   axiosClient
//     .delete(`/api/tracks/${trackId}`)
//     .then((response) => {
//       console.log("Track deleted successfully:", response.data);
//       // Optionally, remove the track from the local state
//       tracks.value = tracks.value.filter((track) => track.id !== trackId);
//     })
//     .catch((error) => {
//       console.error("Error deleting track:", error);
//     });
// }
</script>

<template>
  <!-- <header>
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight">My Tracks</h1>
      <p>All of your current uploaded tracks</p>
    </div>
  </header> -->
  <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
    <!-- <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> -->
    <div class="bg-neutral-800 rounded-lg flex justify-between p-8 mb-8">
      <div class="flex">
        <!-- <button @click="togglePlay">
          <PauseCircleIcon
            v-if="isPlaying"
            class="w-10 h-10 hover:text-neutral-500 transition-colors text-white"
          />
          <PlayCircleIcon
            fill="white"
            v-else
            class="w-10 h-10 hover:text-neutral-500 transition-colors"
          />
        </button> -->
        <img
          :src="viewedTrack?.imageUrl"
          class="h-60 w-60 object-fill rounded-lg mr-8"
        />
        <div class="flex flex-col justify-between">
          <div>
            <h1 class="text-4xl font-bold tracking-tight flex flex-col">
              {{ viewedTrack?.title }}
            </h1>
            <a
              class="text-neutral-400 text-sm hover:text-neutral-300 hover:cursor-pointer transition-colors"
              @click="
                viewedTrack?.creator &&
                  router.push({
                    name: 'UserProfile',
                    params: { username: viewedTrack?.creator },
                  })
              "
            >
              {{ viewedTrack?.creator }}
            </a>
          </div>
          <!-- <p>{{ viewedTrack?.description }}</p> -->
        </div>
      </div>
      <div class="space-y-2 text-sm">
        <p>{{ timeAgoIntl(viewedTrack?.createdAt) }}</p>

        <p class="text-sm bg-neutral-700 p-2 rounded-xl h-fit text-center">
          # {{ viewedTrack?.genre }}
        </p>
      </div>
    </div>
    <div class="flex gap-12">
      <div class="flex flex-col items-center gap-2">
        <img
          :src="viewedTrack?.creatorImageUrl"
          class="w-40 h-40 rounded-full"
        />
        <a
          class="text-lg font-semibold hover:cursor-pointer transition-colors"
          @click="
            viewedTrack?.creator &&
              router.push({
                name: 'UserProfile',
                params: { username: viewedTrack?.creator },
              })
          "
        >
          {{ viewedTrack?.creator }}
        </a>
        <p class="text-sm text-neutral-400">120K Followers</p>
        <div class="rounded-lg p-2 bg-white text-black flex items-center gap-2">
          <UserPlusIcon class="h-5 w-5" />
          <p class="font-semibold">Follow</p>
        </div>
      </div>
      <div class="w-full">
        <div class="flex flex-row gap-2">
          <input
            v-model="commentInputData.comment"
            id="comment"
            type="comment"
            name="comment"
            autocomplete="comment"
            placeholder="Write a comment"
            class="block w-full rounded-md bg-white/5 px-3 py-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-neutral-500 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:text-sm/6 transition-colors"
          />
          <button
            class="rounded-lg font-semibold flex gap-2 items-center bg-neutral-700 px-3 py-1.5 text-sm/6 text-white transition-all"
            :class="
              commentInputData.comment.trim()
                ? 'hover:bg-neutral-600 cursor-pointer'
                : 'opacity-50'
            "
            :disabled="!commentInputData.comment.trim()"
            @click="postComment"
          >
            <PaperAirplaneIcon class="h-5 w-5" />
            <p>Post</p>
          </button>
        </div>
        <div class="mt-6">
          <p class="mb-8 font-bold">Comments</p>
          <div v-if="comments.length === 0" class="text-center">
            <p class="text-3xl font-bold mb-2">No comments on this track</p>
            <p>Be the first to comment on this track</p>
          </div>
          <div
            v-else
            v-for="comment in comments"
            :key="comment.id"
            class="flex items-center gap-4 space-y-7"
          >
            <img
              :src="comment.user.profile.imageUrl"
              width="60"
              height="60"
              class="rounded-full"
            />
            <div class="space-y-1">
              <p class="font-bold">
                {{ comment.user.username
                }}<span class="text-neutral-400 text-sm ml-2 font-normal">
                  {{ timeAgoIntl(comment?.createdAt) }}</span
                >
              </p>
              <p class="text-sm">{{ comment.comment }}</p>
            </div>
            <pre>{{ commentInputData.comment }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
