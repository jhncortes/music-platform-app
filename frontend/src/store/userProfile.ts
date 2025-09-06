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
        const { data } = await axiosClient.get(`/api/user/${username}`);

        // Flatten the response
        this.userProfile = {
          id: data.user.id,
          username: data.user.username,
          name: data.user.name,
          imageUrl: data.profile.avatar || "",
          bio: data.profile.bio,
        };

        console.log("User profile data fetched:", this.userProfile);
        return this.userProfile;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
    },
  },
});

export default useUserProfileStore;
