<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Popup from "../Utilities/Popup.vue";
import { useI18n } from "vue-i18n"; // Import the useI18n hook

const { t } = useI18n();

const isPopupVisible = ref(false);
const popupMessageType = ref(null); // Use null or a specific default type
const popupMessage = computed(() => {
    switch (popupMessageType.value) {
        case "emptyInput":
            return t("fields_cannot_be_empty");
        case "invalidCredentials":
            return t("invalid_credentials");
        case "serverError":
            return t("server_error_try_again_later");
        default:
            return ""; // Default message or condition
    }
});

const form = ref({
    email: "",
    password: "",
});

const router = useRouter();

const showPopupMessage = (type) => {
    popupMessageType.value = type;
    isPopupVisible.value = true;
};

const login = async () => {
    if (!form.value.email || !form.value.password) {
        showPopupMessage("emptyInput");
        return;
    }

    try {
        await axios.get("/sanctum/csrf-cookie");
        const response = await axios.post("/api/login", form.value);
        console.log("Login successful", response.data);
        router.push({ name: "index" });
    } catch (error) {
        console.error("An error occurred during login", error.response);
        if (error.response && error.response.status === 422) {
            showPopupMessage("invalidCredentials");
        } else {
            showPopupMessage("serverError");
        }
    }
};
</script>

<template>
    <div class="flex justify-center mt-12">
        <div
            class="flex flex-col justify-center items-center bg-[#c4dff6] rounded-xl p-3 text-xl mt-28 border-2 border-sky-400"
        >
            <h1 class="p-2 mb-3">
                <i
                    class="fa-solid fa-right-to-bracket"
                    style="font-size: 5rem; color: rgb(3 105 161)"
                ></i>
            </h1>
            <form
                @submit.prevent="login"
                class="flex flex-col justify-center items-center gap-3"
            >
                <div class="flex flex-col justify-center items-center gap-1">
                    <div class="relative">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                            <i
                                class="fa-solid fa-envelope"
                                style="color: rgb(59 130 246)"
                            ></i>
                        </span>
                        <input
                            type="email"
                            id="email"
                            v-model="form.email"
                            placeholder="Email"
                            class="rounded-full bg-gray-200 text-blue-950 text-center outline-sky-500 py-2 pl-9 pr-9 border border-sky-400 focus:ring-sky-500 focus:border-sky-500"
                        />
                    </div>
                </div>
                <div class="flex flex-col justify-center items-center gap-1">
                    <div class="relative">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                            <i
                                class="fa-solid fa-lock"
                                style="color: rgb(59 130 246)"
                            ></i>
                        </span>
                        <input
                            type="password"
                            id="password"
                            v-model="form.password"
                            :placeholder="t('password')"
                            class="rounded-full bg-gray-200 text-blue-950 text-center outline-sky-500 py-2 pl-9 pr-9 border border-sky-400 focus:border-sky-500"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    class="mx-auto block bg-[#77b6ea] p-2 rounded-lg text-1 self-center border-2 border-sky-500 mt-1 hover:bg-sky-500 transition-colors text-blue-950"
                >
                    {{ $t("login") }}
                </button>
            </form>
        </div>
        <Popup
            :message="popupMessage"
            :isVisible="isPopupVisible"
            @update:isVisible="isPopupVisible = $event"
        />
    </div>
</template>
