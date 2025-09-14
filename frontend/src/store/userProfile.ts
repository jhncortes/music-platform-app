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

        // Flatten the response
        this.userProfile = {
          id: response.data.id,
          username: response.data.username,
          name: response.data.name,
          imageUrl: response.data.imageUrl || "",
          bio: response.data.bio,
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
