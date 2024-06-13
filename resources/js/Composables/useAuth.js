// useAuth.js
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const isAuthenticated = ref(false);
const userName = ref("");

/**
 * useAuth hook for authentication state and common auth methods
 *
 * Returns object with:
 * - isAuthenticated: ref to boolean authentication state
 * - userName: ref to current logged in user's name
 * - checkAuthentication: async method to verify auth state
 * - navigateTo: helper to navigate routes by name
 * - logout: async method to log out user
 */
export function useAuth() {
    const router = useRouter();
    async function checkAuthentication() {
        try {
            const response = await axios.get("/api/user");
            isAuthenticated.value = true;
            userName.value = response.data.name;
        } catch (error) {
            isAuthenticated.value = false;
            userName.value = "";
        }
    }

    async function logout() {
        try {
            // The server should clear the HTTP-only cookie upon successful logouts
            await axios.post("/api/logout");
            isAuthenticated.value = false;
            userName.value = "";
            navigateTo("login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    function navigateTo(routeName, params = {}) {
        router.push({ name: routeName, params });
    }

    return {
        isAuthenticated,
        userName,
        checkAuthentication,
        navigateTo,
        logout,
    };
}
