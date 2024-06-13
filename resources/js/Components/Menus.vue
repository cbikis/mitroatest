<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../Composables/useAuth";
import { useI18n } from "vue-i18n";

const { isAuthenticated, logout } = useAuth();

const leftSidebarOpen = ref(false);
const rightMenuOpen = ref(false);
const englishFlagImage = ref(`${assetBaseImagePath}/uk-250-36x36.webp`);
const greekFlagImage = ref(`${assetBaseImagePath}/gr-250-36x36.png`);

const { locale } = useI18n();
const toggleLanguage = () => {
    locale.value = locale.value === "el" ? "en" : "el";
};

const toggleLeftSidebar = () => {
    leftSidebarOpen.value = !leftSidebarOpen.value;
};

const toggleRightMenu = () => {
    rightMenuOpen.value = !rightMenuOpen.value;
};

const closeSidebars = () => {
    leftSidebarOpen.value = false;
    rightMenuOpen.value = false;
};

const router = useRouter();

// Watch for route changes
router.afterEach(() => {
    closeSidebars();
});

// Clean up the watcher when the component is unmounted
onBeforeUnmount(() => {
    router.afterEach(() => {});
});
</script>

<template>
    <div class="flex h-screen overflow-y-auto text-black">
        <!-- Sidebar -->
        <aside
            :class="leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
            class="w-64 bg-gray-100 fixed inset-y-0 left-0 transform transition-transform duration-300 z-30 shadow-black shadow-lg"
        >
            <!-- Close icon -->
            <button
                @click="toggleLeftSidebar"
                class="absolute top-0 right-0 p-4"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <nav class="pt-12">
                <router-link
                    to="/"
                    class="flex items-center gap-2 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300"
                >
                    <i class="fa-solid fa-house w-6 text-center"></i>
                    <span>{{ $t("home") }}</span>
                </router-link>
            </nav>
        </aside>

        <!-- Main content area -->
        <div class="flex-1 relative text-sky-500" @click="closeSidebars">
            <!-- Top Banner -->
            <div
                class="flex absolute top-0 left-0 right-0 bg-[#002e69] py-2 z-20 items-center"
            >
                <img
                    src="../../../public/img/Logo-EL-Color-Light.png"
                    alt="Banner"
                    class="h-auto max-w-xs ml-16"
                />
                <!-- Image centered in the banner -->
                <div class="border-l border-white h-24 mx-4"></div>
                <div class="text-white text-2xl mr-16">{{ $t("national_registries_header") }}</div>
                <!-- <div class="text-white text-2xl">ΕΘΝΙΚΑ ΜΗΤΡΩΑ</div>
                <div class="text-white text-2xl">ΑΝΑΓΝΩΡΙΣΜΕΝΩΝ ΙΔΡΥΜΑΤΩΝ ΚΑΙ ΤΥΠΩΝ ΤΙΤΛΩΝ ΣΠΟΥΔΩΝ</div> -->


            </div>
            <!-- Left Toggle Button -->
            <button
                @click.stop="toggleLeftSidebar"
                class="absolute top-0 left-0 p-4 z-20"
            >
                <!-- Left Menu icon -->
                <i class="fa-solid fa-bars fa-2xl"></i>
            </button>

            <!-- Page Content -->
            <div class="relative z-10 max-h-screen">
                <router-view></router-view>
            </div>
            <div class="absolute top-0 right-8 p-4 z-20 cursor-pointer" @click.stop="toggleLanguage">
                <img width="36" height="36" 
                :src="locale === 'en' ? englishFlagImage : greekFlagImage" 
                class="menu-image menu-image-title-after">
            </div>
            
            <!-- Right Toggle Button -->
            <button
                @click.stop="toggleRightMenu"
                class="absolute top-0 right-0 p-4 z-20"
            >
                <!-- Right Menu Icon -->
                <i class="fa-solid fa-user fa-2xl"></i>
            </button>
            <!-- Rounded Pop-up Menu -->
            <div
                v-if="rightMenuOpen && !isAuthenticated"
                class="absolute right-0 top-14 p-2 bg-gray-100 shadow-black rounded-lg shadow-lg z-30 mr-4"
            >
                <div
                    class="flex items-center justify-center gap-2 mb-1"
                    @click.stop
                >
                    <!-- Language Switch -->
                    <label class="relative inline-block w-12 h-7">
                        <input
                            type="checkbox"
                            class="sr-only"
                            :checked="locale === 'en'"
                            @change="toggleLanguage"
                        />
                        <span
                            :class="
                                locale === 'en' ? 'bg-sky-700' : 'bg-[#c4dff6]'
                            "
                            class="block w-full h-full rounded-full shadow-inner transition-colors duration-300"
                        ></span>
                        <span
                            :class="
                                locale === 'en'
                                    ? 'translate-x-4'
                                    : 'translate-x-0'
                            "
                            class="absolute left-1 bottom-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300"
                        ></span>
                    </label>
                    <span v-if="locale === 'en'" class="text-lg"> 🇺🇸 </span>
                    <span v-else class="text-lg"> 🇬🇷 </span>
                </div>
                <router-link
                    to="/login"
                    class="flex items-center gap-2 py-2.5 px-4 text-black hover:bg-gray-300 rounded transition duration-200"
                >
                    <i class="fa-solid fa-right-to-bracket w-5 text-center"></i>
                    <span>{{ $t("login") }}</span>
                </router-link>
            </div>
            <div
                v-else-if="rightMenuOpen && isAuthenticated"
                class="absolute right-0 top-14 p-2 bg-gray-100 rounded-lg shadow-black shadow-lg z-30 mr-4"
            >
                <div
                    class="flex items-center justify-center gap-2 mb-1"
                    @click.stop
                >
                    <!-- Language Switch -->
                    <label class="relative inline-block w-12 h-7">
                        <input
                            type="checkbox"
                            class="sr-only"
                            :checked="locale === 'en'"
                            @change="toggleLanguage"
                        />
                        <span
                            :class="
                                locale === 'en'
                                    ? 'bg-[#77b6ea]'
                                    : 'bg-[#c4dff6]'
                            "
                            class="block w-full h-full rounded-full shadow-inner transition-colors duration-300"
                        ></span>
                        <span
                            :class="
                                locale === 'en'
                                    ? 'translate-x-4'
                                    : 'translate-x-0'
                            "
                            class="absolute left-1 bottom-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300"
                        ></span>
                    </label>
                    <span v-if="locale === 'en'" class="text-lg"> 🇺🇸 </span>
                    <span v-else class="text-lg"> 🇬🇷 </span>
                </div>

                <div
                    class="flex items-center gap-2 py-2.5 px-4 text-black hover:bg-gray-300 rounded transition duration-200 cursor-pointer"
                    @click.prevent="logout"
                >
                    <i class="fa-solid fa-arrow-right w-5 text-center"></i>
                    <span>{{ $t("logout") }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
