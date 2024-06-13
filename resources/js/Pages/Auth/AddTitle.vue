<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import { useCountriesStore } from "../../stores/countriesStore";
import { useTitlesStore } from "../../../js/stores/titlesStore";
import Popup from "../Utilities/Popup.vue";
import CustomDropdown from "../Utilities/CustomDropdown.vue";
import { useI18n } from "vue-i18n"; // Import the useI18n hook

const { t } = useI18n();

const countries = computed(() => countriesStore.countries);
const titles = computed(() => titlesStore.titles);
const countriesStore = useCountriesStore(); // Use the Pinia store
const titlesStore = useTitlesStore(); // Use the Pinia store

const titleForm = reactive({
    country_id: "",
    title: "",
    title_type: "",
    info: "",
});

const isPopupVisible = ref(false);
const popupMessageType = ref(null); // Use null or a specific default type
const popupMessage = computed(() => {
    switch (popupMessageType.value) {
        case "emptyInput":
            return t("please_select_country_title_and_type");
        case "emptyCountryTitleInput":
            return t("please_select_country_and_title");
        case "emptyCountryTypeInput":
            return t("please_select_country_and_type");
        case "emptyTitleTypeInput":
            return t("please_enter_title_and_type");
        case "emptyCountryInput":
            return t("please_select_a_country");
        case "emptyTitleInput":
            return t("please_input_title_name");
        case "emptyTypeInput":
            return t("please_input_title_type");
        case "titleExists":
            return t("title_already_exists");
        case "titleAddedSuccessfully":
            return t("title_added_successfully");
        case "error":
            return t("error_submitting_form");
        default:
            return ""; // Default message or condition
    }
});
onMounted(async () => {
    await countriesStore.fetchCountries();
    await titlesStore.fetchTitles();
});

const submitTitleForm = async () => {
    // Check for missing inputs and show error messages accordingly
    if (!titleForm.country_id && !titleForm.title && !titleForm.title_type) {
        popupMessageType.value = "emptyInput";
        isPopupVisible.value = true;
        return;
    } else if (!titleForm.country_id && !titleForm.title) {
        popupMessageType.value = "emptyCountryTitleInput";
        isPopupVisible.value = true;
        return;
    } else if (!titleForm.country_id && !titleForm.title_type) {
        popupMessageType.value = "emptyCountryTypeInput";
        isPopupVisible.value = true;
        return;
    } else if (!titleForm.title && !titleForm.title_type) {
        popupMessageType.value = "emptyTitleTypeInput";
        isPopupVisible.value = true;
        return;
    } else if (!titleForm.country_id) {
        popupMessageType.value = "emptyCountryInput";
        isPopupVisible.value = true;
        return;
    } else if (!titleForm.title) {
        popupMessageType.value = "emptyTitleInput";
        isPopupVisible.value = true;
        return;
    } else if (!titleForm.title_type) {
        popupMessageType.value = "emptyTypeInput";
        isPopupVisible.value = true;
        return;
    }

    // Normalize and remove diacritics for case-insensitive comparison
    const normalizeDiacritics = (str) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Convert the submitted title to uppercase for case-insensitive comparison
    const submittedTitleNormalized = titleForm.title.toLocaleUpperCase();

    // Check if the title already exists (case-insensitive, no diacritics) and has the same country_id
    const titleExists = titles.value.some((title) => {
        const existingTitleNormalized = normalizeDiacritics(
            title.title.toLocaleUpperCase()
        );
        const isSameCountry = title.country_id === titleForm.country_id;
        return (
            existingTitleNormalized === submittedTitleNormalized &&
            isSameCountry
        );
    });

    if (titleExists) {
        // If the title exists, show an error message in the popup
        popupMessageType.value = "titleExists";
        isPopupVisible.value = true;
    } else {
        try {
            const response = await axios.post(
                "/api/add-foreign-title",
                titleForm
            );

            // Handle success
            popupMessageType.value = "titleAddedSuccessfully";
            isPopupVisible.value = true;
            // Clear the form or other success actions
            titleForm.title = "";
            titleForm.title_type = "";
            titleForm.info = "";

            // Add the new title to the store
            titlesStore.addTitle(response.data);
            titlesStore.broadcastUpdate(response.data); // Broadcast the update to other tabs
        } catch (error) {
            console.error("Υπήρξε ένα σφάλμα στην αποστολή της φόρμας", error);
            // Handle error
            popupMessageType.value = "error";
            isPopupVisible.value = true;
        }
    }
};
</script>

<template>
    <div class="flex justify-center mt-12 text-blue-950">
        <div
            class="flex flex-col justify-center items-center bg-[#c4dff6] rounded-xl p-3 mt-28 border-2 border-sky-400 max-w-2xl w-full"
        >
            <div class="flex flex-wraptext-gray-700 mt-2 self-start px-3">
                <div>
                    <i
                        class="fas fa-info-circle"
                        style="margin-right: 0.5rem"
                    ></i>
                    {{ t("add_title_form_add_title") }}
                </div>
            </div>
            <form
                @submit.prevent="submitTitleForm"
                class="flex flex-col justify-center gap-3 w-full px-3"
            >
                <hr class="border-t border-white w-full my-4 px-3" />
                <div class="mb-4">
                    <label
                        for="country_id_title"
                        class="block text-sm font-medium mb-1"
                        >{{ t("add_title_form_country") }}</label
                    >
                    <CustomDropdown
                        id="country_id_title"
                        :options="countries"
                        option-value="id"
                        option-text="country"
                        v-model="titleForm.country_id"
                        :placeholder="t('choose_country')"
                        required
                    />
                </div>

                <div class="mb-4">
                    <label for="title" class="block text-sm font-medium">
                        {{ t("add_title_form_title") }}
                    </label>
                    <input
                        id="title"
                        v-model="titleForm.title"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>

                <div class="mb-4">
                    <label for="title_type" class="block text-sm font-medium">{{
                        t("add_title_form_title_type")
                    }}</label>
                    <input
                        id="title_type"
                        v-model="titleForm.title_type"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>

                <div class="mb-4">
                    <label for="info_title" class="block text-sm font-medium">
                        {{ t("add_title_form_information") }}
                    </label>
                    <input
                        id="info_title"
                        v-model="titleForm.info"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>

                <!-- Submit button -->
                <button
                    class="px-4 py-2 bg-[#77b6ea] rounded-md hover:bg-sky-500 self-end"
                    type="submit"
                >
                    <i class="fas fa-save" style="margin-right: 0.5rem"></i>
                    {{ t("save") }}
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
