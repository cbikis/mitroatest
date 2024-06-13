<script setup>
import { defineProps, onMounted, onUnmounted, computed, ref } from "vue";
import { useInstitutesStore } from "../stores/institutesStore";
import { useAuth } from "../Composables/useAuth";
import { useI18n } from "vue-i18n";


// Define the props that are passed from the parent component
const props = defineProps({
    data: Array,
    sortColumn: String,
    sortDirection: String,
    sortTable: Function,
    redirectToView: Function,
    redirectToEdit: Function, // Renamed to be more generic
    confirmDelete: Function,
    currentPage: Number,
    totalPages: Number,
    pages: Array,
    showInstitutes: Boolean, // Add this to determine which dataset to show
    isDeleteConfirmationVisible: Boolean,
});

const { isAuthenticated, checkAuthentication } = useAuth();
// Define the emits
const emit = defineEmits([
    "update:currentPage",
    "confirmDelete",
    "deleteSelectedInstitute",
    "deleteSelectedTitle",
    "update:isDeleteConfirmationVisible",
    "certificateClick",
]);

// Emit an event when a pagination button is clicked
const setCurrentPage = (page) => {
    emit("update:currentPage", page);
};

// Define methods to handle delete actions
const confirmDelete = (id) => {
    emit("confirmDelete", id);
};

const deleteSelectedInstitute = () => {
    emit("deleteSelectedInstitute");
};

const deleteSelectedTitle = () => {
    emit("deleteSelectedTitle");
};

// Use the store
const institutesStore = useInstitutesStore();

// Access the selectedCountryName from the store's state
const selectedCountryName = computed(() => institutesStore.selectedCountryName);

const selectedShowInstitutes = computed(() => institutesStore.selectedShowInstitutes);

const handleCertificateClick = (item) => {
    // Emit an event to the parent component with the country name
    emit("certificateClick", item.country);
};

const isMenuVisible = ref(false);
const isCountryMenuVisible = ref(false);
const button = ref(null);
const countryButton = ref(null); // Updated ref name
const dropdownMenu = ref(null);
const dropdownCountryMenu = ref(null);

const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
};

const toggleCountryMenu = () => {
    isCountryMenuVisible.value = !isCountryMenuVisible.value;
};

const closeMenu = (event) => {
    if (
        isMenuVisible.value &&
        button.value &&
        dropdownMenu.value &&
        !button.value.contains(event.target) &&
        !dropdownMenu.value.contains(event.target)
    ) {
        isMenuVisible.value = false;
    }
};

const closeCountryMenu = (event) => {
    if (
        isCountryMenuVisible.value &&
        countryButton.value && // Updated ref name
        dropdownCountryMenu.value && // Updated ref name
        !countryButton.value.contains(event.target) && // Updated ref name
        !dropdownCountryMenu.value.contains(event.target) // Updated ref name
    ) {
        isCountryMenuVisible.value = false;
    }
};
// Tooltip data
const tooltipData = ref({
    visible: false,
    content: "",
    top: 0,
    left: 0,
});


const { t, locale } = useI18n();

const warningText = computed(() => {

    let result;

    if (!isShowDataVisible()) {
        return t("institutes_and_country_prompt");
    }
    if (typeof selectedShowInstitutes !== 'undefined' && selectedShowInstitutes.value) {
        if (selectedCountryName.value && selectedCountryName.value !== "-1") {
            result = t("institutes_of") + selectedCountryName.value;
        } else {
            result = t("institutes_per_country");
        }
    } else {
        if (selectedCountryName.value && selectedCountryName.value !== "-1") {
            result = t("titles_of") + selectedCountryName.value;
        } else {
            result = t("titles_per_country");
        }
    }
    
    return result;
});

const isShowInstitutesVisible = () => {
    typeof showInstitutes !== 'undefined' && showInstitutes.value;
}

const isShowTitlesVisible = () => {
    return showInstitutes.value === false;
}

const isShowDataVisible = () => {
    return (typeof selectedShowInstitutes !== 'undefined' && selectedShowInstitutes.value !== null && typeof selectedCountryName !== 'undefined' && selectedCountryName.value !== null);
}

// Show tooltip
const showTooltip = (content, event) => {
    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const tooltipHeight = 20; // Adjust this value based on the actual height of your tooltip
    const offset = 10; // Additional offset from the button

    tooltipData.value = {
        visible: true,
        content: content,
        // Position the tooltip higher above the button
        top: window.scrollY + buttonRect.top - tooltipHeight - offset,
        left: buttonRect.left + buttonRect.width / 2, // Centered above the button
        transform: "translateX(-50%)", // Center the tooltip horizontally
    };
};

// Hide tooltip
const hideTooltip = () => {
    tooltipData.value.visible = false;
};
onMounted(() => {
    checkAuthentication();
    window.addEventListener("click", closeMenu);
    window.addEventListener("click", closeCountryMenu);
});

onUnmounted(() => {
    window.removeEventListener("click", closeMenu);
    window.removeEventListener("click", closeCountryMenu);
});
</script>

<template>
    <div class="flex justify-between mb-1 relative">
        <div class="flex flex-wraptext-gray-700 self-end">
            <div class="text-black">
                <i class="fas fa-info-circle" style="margin-right: 0.5rem"></i>



                <!-- {{
                    !isShowDataVisible()
                    ? $t("institutes_and_country_prompt") :
                    isShowInstitutesVisible()
                        ? (selectedCountryName && selectedCountryName !== "-1")
                            ? $t("institutes_of") + selectedCountryName
                            : $t("institutes_per_country")
                        : (selectedCountryName && selectedCountryName !== "-1")
                        ? $t("titles_of") + selectedCountryName
                        : $t("titles_per_country")
                }} -->
                {{ warningText }}
     
                 <!-- {{
                    showInstitutes
                        ? (selectedCountryName && selectedCountryName !== "-1")
                            ? $t("institutes_of") + selectedCountryName
                            : $t("institutes_per_country")
                        : (selectedCountryName && selectedCountryName !== "-1")
                        ? $t("titles_of") + selectedCountryName
                        : $t("titles_per_country")
                }} -->
            </div>
        </div>
        <div>
            <button
                v-if="isAuthenticated && isShowDataVisible()"
                class="px-4 py-2 bg-[#c4dff6] rounded-lg hover:bg-[#77b6ea] self-end mr-[0.79rem] text-lg text-black"
                ref="countryButton"
                @click="toggleCountryMenu"
            >
                <i class="fas fa-ellipsis-v" style="margin-right: 0.5rem"></i>
                {{ $t("country_menu_options_title") }}
            </button>
            <div
                v-if="isCountryMenuVisible && isAuthenticated && isShowDataVisible()"
                ref="dropdownCountryMenu"
                class="absolute right-24 mt-1 p-2 bg-[#77b6ea] rounded-lg shadow-lg z-30"
            >
                <router-link
                    to="/edit-country"
                    class="flex items-center gap-2 py-2.5 px-4 text-black hover:bg-[#77b6ea] rounded transition duration-200"
                >
                    <i class="fa-solid fa-pen-to-square w-5 text-center"></i>
                    <span>{{ $t("edit_country") }}</span>
                </router-link>
                <router-link
                    to="/delete-country"
                    class="flex items-center gap-2 py-2.5 px-4 text-black hover:bg-[#77b6ea] rounded transition duration-200"
                >
                    <i class="fa-solid fa-trash w-5 text-center"></i>
                    <span>{{ $t("delete_country") }}</span>
                </router-link>
            </div>

            <button
                v-if="isAuthenticated && isShowDataVisible()"
                class="px-4 py-2 bg-[#c4dff6] rounded-lg text-black hover:bg-[#77b6ea] self-end mr-[0.79rem] text-lg"
                ref="button"
                @click="toggleMenu"
            >
                <i class="fas fa-plus" style="margin-right: 0.3rem"></i>
                {{ $t("add") }}
            </button>
            <div
                v-if="isMenuVisible && isAuthenticated && isShowDataVisible()"
                ref="dropdownMenu"
                class="absolute right-0 mt-1 p-2 bg-[#77b6ea] rounded-lg shadow-lg z-30"
            >
                <router-link
                    to="/add-country"
                    class="flex items-center gap-2 py-2.5 px-4 text-black hover:bg-[#c4dff6] rounded transition duration-200"
                >
                    <i class="fa-solid fa-earth-europe w-5 text-center"></i>
                    <span>{{ $t("add_country") }}</span>
                </router-link>
                <router-link
                    to="/add-institute"
                    class="flex items-center gap-2 py-2.5 px-4 text-black hover:bg-[#c4dff6] rounded transition duration-200"
                >
                    <i class="fa-solid fa-building-columns w-5 text-center"></i>
                    <span>{{ $t("add_insitute") }}</span>
                </router-link>
                <router-link
                    to="/add-title"
                    class="flex items-center gap-2 py-2.5 px-4 text-black hover:bg-[#c4dff6] rounded transition duration-200"
                >
                    <i class="fa-solid fa-certificate w-5 text-center"></i>
                    <span>{{ $t("add_title") }}</span>
                </router-link>
            </div>
        </div>
    </div>
    <div class="overflow-x-auto bg-blue-100 p-4 rounded-lg" v-if="isShowDataVisible()">

            <table class="min-w-full bg-white border border-gray-300">
                <thead class="bg-blue-800 text-white">
                    <tr>
                        <!-- ID Column -->
                        <th
                            scope="col"
                            class="sortable-header cursor-pointer py-2 px-4 font-bold flex-0 w-1/12"
                            @click="sortTable('id')"
                        >
                            <span class="flex items-center justify-center">
                                ID
                                <i
                                    v-if="
                                        sortColumn === 'id' &&
                                        sortDirection === 'asc'
                                    "
                                    class="fa-solid fa-chevron-up ml-2"
                                ></i>
                                <i
                                    v-else-if="
                                        sortColumn === 'id' &&
                                        sortDirection === 'desc'
                                    "
                                    class="fa-solid fa-chevron-down ml-2"
                                ></i>
                            </span>
                        </th>
                        <!-- COUNTRY Column -->
                        <th
                            scope="col"
                            class="sortable-header cursor-pointer py-2 px-4 font-bold flex-0 w-2/12"
                            @click="sortTable('country')"
                        >
                            <span class="flex items-center">
                                {{ $t("country") }}
                                <i
                                    v-if="
                                        sortColumn === 'country' &&
                                        sortDirection === 'asc'
                                    "
                                    class="fa-solid fa-chevron-up ml-2"
                                ></i>
                                <i
                                    v-else-if="
                                        sortColumn === 'country' &&
                                        sortDirection === 'desc'
                                    "
                                    class="fa-solid fa-chevron-down ml-2"
                                ></i>
                            </span>
                        </th>
                        <!-- INSTITUTE Column -->
                        <th
                            v-if="showInstitutes"
                            scope="col"
                            class="sortable-header cursor-pointer py-2 px-4 font-bold flex-0 w-1/5"
                            @click="sortTable('institute')"
                        >
                            <span class="flex items-center">
                                {{ $t("institute") }}
                                <i
                                    v-if="
                                        sortColumn === 'institute' &&
                                        sortDirection === 'asc'
                                    "
                                    class="fa-solid fa-chevron-up ml-2"
                                ></i>
                                <i
                                    v-else-if="
                                        sortColumn === 'institute' &&
                                        sortDirection === 'desc'
                                    "
                                    class="fa-solid fa-chevron-down ml-2"
                                ></i>
                            </span>
                        </th>
                        <!-- TITLE Column -->
                        <th
                            v-else
                            scope="col"
                            class="sortable-header cursor-pointer py-2 px-4 font-bold"
                            @click="sortTable('title')"
                        >
                            <span class="flex items-center">
                                {{ $t("title") }}
                                <i
                                    v-if="
                                        sortColumn === 'title' &&
                                        sortDirection === 'asc'
                                    "
                                    class="fa-solid fa-chevron-up ml-2"
                                ></i>
                                <i
                                    v-else-if="
                                        sortColumn === 'title' &&
                                        sortDirection === 'desc'
                                    "
                                    class="fa-solid fa-chevron-down ml-2"
                                ></i>
                            </span>
                        </th>

                        <!-- INFORMATION Column -->
                        <th
                            v-if="showInstitutes"
                            scope="col"
                            class="sortable-header cursor-pointer py-2 px-4 font-bold"
                            @click="sortTable('info')"
                        >
                            <span class="flex items-center justify-center">
                                {{ $t("info") }}
                                <i
                                    v-if="
                                        sortColumn === 'info' &&
                                        sortDirection === 'asc'
                                    "
                                    class="fa-solid fa-chevron-up ml-2"
                                ></i>
                                <i
                                    v-else-if="
                                        sortColumn === 'info' &&
                                        sortDirection === 'desc'
                                    "
                                    class="fa-solid fa-chevron-down ml-2"
                                ></i>
                            </span>
                        </th>

                        <th
                            v-else
                            scope="col"
                            class="sortable-header cursor-pointer py-2 px-4 font-bold"
                            @click="sortTable('title_type')"
                        >
                            <span class="flex items-center justify-center">
                                {{ $t("title_type") }}
                                <i
                                    v-if="
                                        sortColumn === 'title_type' &&
                                        sortDirection === 'asc'
                                    "
                                    class="fa-solid fa-chevron-up ml-2"
                                ></i>
                                <i
                                    v-else-if="
                                        sortColumn === 'title_type' &&
                                        sortDirection === 'desc'
                                    "
                                    class="fa-solid fa-chevron-down ml-2"
                                ></i>
                            </span>
                        </th>

                        <!-- FRANCHISE Column -->
                        <th
                            v-if="showInstitutes"
                            scope="col"
                            class="sortable-header cursor-pointer py-2 px-4 font-bold"
                            @click="sortTable('franchise')"
                        >
                            <span class="flex items-center justify-center">
                                {{ $t("franchise") }}
                                <i
                                    v-if="
                                        sortColumn === 'franchise' &&
                                        sortDirection === 'asc'
                                    "
                                    class="fa-solid fa-chevron-up ml-2"
                                ></i>
                                <i
                                    v-else-if="
                                        sortColumn === 'franchise' &&
                                        sortDirection === 'desc'
                                    "
                                    class="fa-solid fa-chevron-down ml-2"
                                ></i>
                            </span>
                        </th>

                        <!-- INFORMATION Column -->
                        <th
                            v-else
                            scope="col"
                            class="sortable-header cursor-pointer py-2 px-4 font-bold text-center"
                            @click="sortTable('info')"
                        >
                            <span class="flex items-center justify-center">
                                {{ $t("info") }}
                                <i
                                    v-if="
                                        sortColumn === 'info' &&
                                        sortDirection === 'asc'
                                    "
                                    class="fa-solid fa-chevron-up ml-2"
                                ></i>
                                <i
                                    v-else-if="
                                        sortColumn === 'info' &&
                                        sortDirection === 'desc'
                                    "
                                    class="fa-solid fa-chevron-down ml-2"
                                ></i>
                            </span>
                        </th>

                        <th
                            v-if="
                                showInstitutes ||
                                (!showInstitutes && isAuthenticated)
                            "
                            scope="col"
                            class="py-2 px-4 text-center font-bold"
                        >
                            {{ $t("options") }}
                        </th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr
                        v-for="(item, index) in data"
                        :key="item.id"
                        :class="
                            index % 2 === 0 ? 'bg-[#c4dff6]' : 'bg-[#77b6ea]'
                        "
                    >
                        <td class="border-t border-gray-300 py-2 px-4 text-center flex-0 w-1/12">
                            {{ item.id }}
                        </td>
                        <td class="border-t border-gray-300 py-2 px-4 flex-0 w-2/12">
                            {{ item.country }}
                        </td>
                        <td class="border-t border-gray-300 py-2 px-4 flex-0 w-1/5">
                            {{ showInstitutes ? item.institute : $t(item.title) }}
                        </td>
                        <td class="border-t border-gray-300 py-2 px-4 text-center">
                            <div v-if="showInstitutes">
                                <div v-if="item.info">
                                    {{ item.info }}
                                </div>
                                <div v-else class="text-center text-3xl">-</div>
                            </div>
                            <div v-else>{{ $t(item.title_type) }}</div>
                        </td>
                        <td class="border-t border-gray-300 py-2 px-4 text-center text-center">
                            <div v-if="showInstitutes">
                                {{ item.franchise ? $t("yes") : $t("no") }}
                            </div>
                            <div v-else>
                                <div v-if="item.info">
                                    {{ item.info }}
                                </div>
                                <div v-else class="text-center text-3xl">-</div>
                            </div>
                        </td>
                        <td
                            v-if="
                                showInstitutes ||
                                (!showInstitutes && isAuthenticated)
                            "
                            class="border-t border-gray-300 py-2 px-4 text-center"
                        >
                            <button
                                v-if="showInstitutes"
                                @click="handleCertificateClick(item)"
                                @mouseover="
                                    (event) =>
                                        showTooltip(
                                            $t('recognized_titles'),
                                            event
                                        )
                                "
                                @mouseleave="hideTooltip"
                                class="mx-1 px-4 py-2 text-amber-400 rounded relative"
                            >
                                <i
                                    class="fa-solid fa-certificate w-5 text-center text-xl"
                                ></i>
                            </button>
                            <button v-if="showInstitutes"
                                class="mx-1 px-4 py-2 text-blue-900 rounded"
                                @click="redirectToView(item)"
                            >
                                <i
                                    class="fa-solid fa-circle-info w-5 text-center text-xl"
                                ></i>
                            </button>
                            <button
                                v-if="isAuthenticated"
                                class="mx-1 px-4 py-2 text-blue-900 rounded"
                                @click="redirectToEdit(item)"
                            >
                                <i
                                    class="fa-solid fa-pen-to-square w-5 text-center text-xl"
                                ></i>
                            </button>
                            <button
                                v-if="isAuthenticated"
                                class="mx-1 px-4 py-2 text-red-600 rounded"
                                @click="confirmDelete(item.id)"
                            >
                                <i
                                    class="fa-solid fa-trash-can w-5 text-center text-xl"
                                ></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    <div
        v-if="tooltipData.visible"
        :style="{
            position: 'fixed',
            top: tooltipData.top + 'px',
            left: tooltipData.left + 'px',
            transform: 'translateX(-50%)', // Center the tooltip
        }"
        class="shadow-lg z-50 bg-sky-500 text-black rounded py-1 px-2"
    >
        {{ $t("recognized_titles") }}
    </div>
    <div
        v-if="props.isDeleteConfirmationVisible"
        class="fixed inset-0 bg-[#c4dff6] bg-opacity-75 flex items-center justify-center z-50"
    >
        <div class="bg-sky-300 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
                {{
                    showInstitutes ? $t("delete_institute") : $t("delete_title")
                }}
            </h3>
            <p class="mt-2 text-sm text-black">
                {{
                    showInstitutes
                        ? $t("delete_institute_question")
                        : $t("delete_title_question")
                }}
            </p>
            <div class="mt-4 flex justify-end">
                <button
                    @click="$emit('update:isDeleteConfirmationVisible', false)"
                    class="bg-[#c4dff6] text-gray-800 rounded px-4 py-2 mr-2 hover:bg-[#77b6ea] focus:outline-none focus:border-gray-400 focus:shadow-outline-gray"
                >
                    {{ $t("cancel") }}
                </button>
                <button
                    @click="
                        showInstitutes
                            ? deleteSelectedInstitute()
                            : deleteSelectedTitle()
                    "
                    class="bg-red-600 text-black rounded px-4 py-2 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:shadow-outline-red"
                >
                    {{ $t("delete") }}
                </button>
            </div>
        </div>
    </div>

    <div class="flex justify-center mt-4 mb-5" v-if="isShowDataVisible()">
        <button
            class="mx-1 px-4 py-2 bg-inherit rounded"
            :class="{
                'text-sky-900 cursor-not-allowed': currentPage === 1,
                'text-sky-600': currentPage !== 1,
            }"
            @click="setCurrentPage(1)"
            :disabled="currentPage === 1"
        >
            <i class="fa-solid fa-angles-left"></i>
        </button>
        <button
            class="mx-1 px-4 py-2 bg-inherit rounded"
            :class="{
                'text-sky-900 cursor-not-allowed': currentPage === 1,
                'text-sky-600': currentPage !== 1,
            }"
            @click="setCurrentPage(currentPage - 1)"
            :disabled="currentPage === 1"
        >
            <i class="fa-solid fa-angle-left"></i>
        </button>
        <!-- Current page buttons -->
        <button
            v-for="page in pages"
            :key="page"
            class="mx-1 px-4 py-2 bg-inherit text-sky-900 rounded"
            :class="{
                'bg-[#c4dff6] text-black': currentPage === page,
                'hover:bg-[#77b6ea]': currentPage !== page,
            }"
            @click="setCurrentPage(page)"
        >
            {{ page }}
        </button>
        <button
            class="mx-1 px-4 py-2 bg-inherit rounded"
            :class="{
                'text-sky-900 cursor-not-allowed': currentPage === totalPages,
                'text-sky-600': currentPage !== totalPages,
            }"
            @click="setCurrentPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
        >
            <i class="fa-solid fa-angle-right"></i>
        </button>
        <button
            class="mx-1 px-4 py-2 bg-inherit rounded"
            :class="{
                'text-sky-900 cursor-not-allowed': currentPage === totalPages,
                'text-sky-600': currentPage !== totalPages,
            }"
            @click="setCurrentPage(totalPages)"
            :disabled="currentPage === totalPages"
        >
            <i class="fa-solid fa-angles-right"></i>
        </button>
    </div>
</template>

<style scoped></style>
