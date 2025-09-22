import { defineStore } from "pinia";
import axiosClient from "../axios";
import type { UserProfile } from "../types/User";

const useUserProfileStore = defineStore("userProfile", {
  state: (): { userProfile: UserProfile | null } => ({
    userProfile: null,
  }),
  actions: {
    async fetchProfile(username: string) {
      try {
        const response = await axiosClient.get(`/api/user/${username}`);
        this.userProfile = response.data;

        console.log("User profile data fetched:", response.data);
        return this.userProfile;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
    },
  },
});

export default useUserProfileStore;
