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
  TrashIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from "@heroicons/vue/24/solid";
import router from "../router";
import { useCommentStore } from "../store/comment";
import type { Comment } from "../types/Comment";
import axiosClient from "../axios";

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

const isLiked = ref(viewedTrack.value?.isLiked);
const isFollowing = ref(viewedTrack.value?.creatorProfile?.isFollowing);
const likes = ref(viewedTrack.value?.likes ?? 0);

function togglePlay() {
  trackStore.setCurrentTrack({
    id: viewedTrack.value?.id,
    title: viewedTrack.value?.title,
    imageUrl: viewedTrack.value?.imageUrl,
    audioUrl: viewedTrack.value?.audioUrl,
    genre: viewedTrack.value?.genre,
    description: viewedTrack.value?.description,
    createdAt: viewedTrack.value?.createdAt,
    updatedAt: viewedTrack.value?.updatedAt,
    creatorProfile: viewedTrack.value?.creatorProfile,
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

function deleteComment(commentId: number) {
  if (!confirm("Are you sure you want to delete this comment?")) {
    return;
  }
  axiosClient
    .delete(`/api/comment/${commentId}`)
    .then((response) => {
      console.log("Comment deleted successfully:", response.data);
      // Optionally, remove the comment from the local state
      commentStore.comments = commentStore.comments.filter(
        (comment) => comment.id !== commentId
      );
    })
    .catch((error) => {
      console.error("Error deleting comment:", error);
    });
}

async function deleteTrack(trackId?: number) {
  try {
    if (!confirm("Are you sure you want to delete this track?")) {
      return;
    }
    const response = await axiosClient.delete(`/api/tracks/${trackId}`);
    // Route back to Tracks page
    router.push({ name: "Tracks" });
    console.log("Successfully deleted track:", response);
  } catch (error) {
    console.error("Error deleting track:", error);
  }
}

async function toggleLikeButton(trackId?: number) {
  try {
    if (!isLiked.value || !likes.value) {
      const likedResponse = await axiosClient.post(
        `/api/tracks/${trackId}/like`
      );
      // Handle locally
      isLiked.value = true;
      likes.value += 1;
      console.log("Successfully liked track:", likedResponse);
    } else {
      const dislikedResponse = await axiosClient.delete(
        `/api/tracks/${trackId}/unlike`
      );
      // Handle locally
      isLiked.value = false;
      likes.value -= 1;
      console.log("Successfully unliked track:", dislikedResponse);
    }
  } catch (error) {
    console.error("Error pressing like button:", error);
  }
}

async function toggleFollowButton(userId?: number) {
  try {
    console.log("Follow button");
    if (
      viewedTrack?.value?.creatorProfile?.id === user.value?.id ||
      !viewedTrack.value
    ) {
      throw Error;
    }

    if (!isFollowing.value) {
      const response = await axiosClient.post(`/api/user/${userId}/follow`);
      isFollowing.value = true;
      console.log("Successfully followed user:", response);
    } else {
      const response = await axiosClient.delete(`/api/user/${userId}/unfollow`);
      isFollowing.value = false;
      console.log("Successfully unfollowed user:", response);
    }
  } catch (error) {
    console.error("Error pressing follow button:", error);
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
    <!-- <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> -->
    <div class="bg-neutral-800 rounded-lg flex justify-between p-8 mb-6">
      <div class="flex">
        <img
          :src="viewedTrack?.imageUrl"
          class="h-60 w-60 object-fill rounded-lg mr-8"
        />
        <div class="flex flex-col justify-between">
          <div>
            <h1 class="text-4xl font-bold tracking-tight flex flex-col">
              {{ viewedTrack?.title }}
            </h1>
            <p
              class="text-neutral-400 text-md hover:text-neutral-300 hover:cursor-pointer transition-colors"
              @click="
                viewedTrack?.creatorProfile?.username &&
                  router.push({
                    name: 'UserProfile',
                    params: { username: viewedTrack?.creatorProfile?.username },
                  })
              "
            >
              {{ viewedTrack?.creatorProfile?.username }}
            </p>
            <p class="text-neutral-400 text-sm">{{ likes }} likes</p>
          </div>
          <p>{{ viewedTrack?.description }}</p>
          <div class="flex gap-2 mt-4 text-xs">
            <button @click="togglePlay" class="w-10 h-10 hover:cursor-pointer">
              <PauseCircleIcon
                v-if="isPlaying"
                class="hover:text-neutral-500 transition-colors text-white"
              />
              <PlayCircleIcon
                fill="white"
                v-else
                class="hover:text-neutral-500 transition-colors"
              />
            </button>
            <button
              v-if="viewedTrack?.creatorProfile?.id === user?.id"
              @click="deleteTrack(viewedTrack?.id)"
              class="rounded-lg p-2 bg-neutral-100 text-neutral-950 flex items-center gap-1 text-xs font-semibold hover:bg-neutral-300 hover:cursor-pointer transition-all"
            >
              <TrashIcon class="h-4 w-4" />
              <p>Delete</p>
            </button>
            <button
              @click="toggleLikeButton(viewedTrack?.id)"
              v-if="viewedTrack?.creatorProfile?.id != user?.id"
              class="hover:cursor-pointer transition-all flex items-center gap-1 text-xs font-semibold rounded-lg p-2"
              :class="{
                ' bg-neutral-100 text-neutral-950  hover:bg-neutral-300':
                  !isLiked,
                'bg-neutral-700 hover:bg-neutral-500': isLiked,
              }"
            >
              <HeartIcon class="h-4 w-4" />
              <p>{{ isLiked ? "Liked" : "Like" }}</p>
            </button>
          </div>

          <!-- <p>{{ viewedTrack?.description }}</p> -->
        </div>
      </div>
      <div class="space-y-2 text-sm">
        <p>{{ timeAgoIntl(viewedTrack?.createdAt) }}</p>

        <p
          class="text-sm bg-neutral-700 p-2 rounded-xl h-fit text-center font-semibold"
        >
          # {{ viewedTrack?.genre }}
        </p>
      </div>
    </div>
    <div class="flex gap-12">
      <div class="flex flex-col items-center gap-2">
        <img
          :src="viewedTrack?.creatorProfile?.imageUrl"
          class="w-40 h-40 rounded-full"
        />
        <a
          class="text-lg font-semibold hover:cursor-pointer hover:text-neutral-300 transition-colors"
          @click="
            viewedTrack?.creatorProfile?.username &&
              router.push({
                name: 'UserProfile',
                params: { username: viewedTrack?.creatorProfile?.username },
              })
          "
        >
          {{ viewedTrack?.creatorProfile?.username }}
        </a>
        <p class="text-sm text-neutral-400">{{}} Followers</p>
        <button
          v-if="viewedTrack?.creatorProfile?.id != user?.id"
          @click="toggleFollowButton(viewedTrack?.creatorProfile?.id)"
          class="rounded-lg p-2 font-semibold bg-neutral-100 text-neutral-950 flex items-center gap-1.5 hover:cursor-pointer hover:bg-neutral-300 transition-all"
        >
          <UserPlusIcon class="h-5 w-5" />
          {{ !isFollowing ? "Follow" : "Following" }}
        </button>
      </div>
      <div class="w-full">
        <div class="flex flex-row gap-2">
          <input
            v-model="commentInputData.comment"
            placeholder="Write a comment"
            class="block w-full rounded-md bg-white/5 px-3 py-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:text-sm/6 transition-colors"
          />
          <button
            class="rounded-lg font-semibold flex gap-2 items-center bg-neutral-700 px-3 py-1.5 text-sm/6 text-neutral-100 transition-all"
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
          <p class="mb-8 font-bold">{{ comments.length }} Comments</p>
          <div v-if="comments.length === 0" class="text-center">
            <p class="text-3xl font-bold mb-2">No comments on this track</p>
            <p>Be the first to comment on this track</p>
          </div>
          <div
            v-else
            v-for="comment in comments"
            :key="comment.id"
            class="flex items-center gap-4 mb-8"
          >
            <img
              :src="comment.user.profile.imageUrl"
              class="rounded-full w-18 h-18"
            />
            <div class="space-y-1">
              <p class="font-bold">
                {{ comment.user.username
                }}<span class="text-neutral-400 text-sm ml-2 font-normal">
                  {{ timeAgoIntl(comment?.createdAt) }}</span
                >
              </p>
              <p class="text-sm">{{ comment.comment }}</p>
              <button
                @click="deleteComment(comment.id)"
                v-if="comment.user.id === user?.id"
                class="rounded-lg p-2 bg-neutral-100 text-neutral-950 flex items-center gap-1 text-xs font-semibold mt-2 hover:bg-neutral-300 hover:cursor-pointer transition-all"
              >
                <TrashIcon class="h-4 w-4" />
                <p>Delete</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
