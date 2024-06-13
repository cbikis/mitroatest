<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useCountriesStore } from "../../stores/countriesStore";
import { useTitlesStore } from "../../stores/titlesStore";
import CustomDropdown from "../Utilities/CustomDropdown.vue";
import Popup from "../Utilities/Popup.vue";
import { useI18n } from "vue-i18n"; // Import the useI18n hook

const { t } = useI18n();

const route = useRoute();
const countriesStore = useCountriesStore(); // Use the store

const countries = computed(() => countriesStore.countries);
const titlesStore = useTitlesStore();
const titleForm = reactive({
    title_id: Number(route.params.id),
    newCountryId: Number(route.query.country),
    newTitle: route.query.title,
    newTitleType: route.query.title_type,
    info: route.query.info,
});

const isPopupVisible = ref(false);
const popupMessageType = ref(null); // Use null or a specific default type
const popupMessage = computed(() => {
    switch (popupMessageType.value) {
        case "empty_title":
            return t("edit_title_form_empty_title");
        case "empty_title_type":
            return t("edit_title_form_empty_title_type");
        case "details_updated_successfully":
            return t("details_updated_successfully");
        case "error":
            return t("error_submitting_form");
        default:
            return ""; // Default message or condition
    }
});

onMounted(async () => {
    countriesStore.fetchCountries();
});

const submitTitleForm = async () => {
    // Standardize inputs for comparison
    const newTitleUpper = titleForm.newTitle.toUpperCase().trim();
    const newTitleTypeUpper = titleForm.newTitleType.toUpperCase().trim();
    const newInfo = titleForm.info.toUpperCase().trim();

    // Check for duplicate title in the same country and title type
    const titleExists = titlesStore.titles.find((title) => {
        return (
            title.country_id === titleForm.newCountryId &&
            title.title.toUpperCase().trim() === newTitleUpper &&
            title.title_type.toUpperCase().trim() === newTitleTypeUpper &&
            title.info === newInfo
        );
    });

    if (titleExists) {
        // Set the error message for duplicate title
        popupMessageType.value = "countryExists";
        isPopupVisible.value = true;
        return; // Exit the function to prevent submitting the form
    }

    const updatedFields = {};
    if (titleForm.newCountryId)
        updatedFields.country_id = titleForm.newCountryId;
    if (titleForm.newTitle) {
        updatedFields.title = titleForm.newTitle;
    } else if (!titleForm.newTitle) {
        popupMessageType.value = "empty_title";
        isPopupVisible.value = true;
        return;
    }
    if (titleForm.newTitleType) {
        updatedFields.title_type = titleForm.newTitleType;
    } else if (!titleForm.newTitleType) {
        popupMessageType.value = "empty_title_type";
        isPopupVisible.value = true;
        return;
    }
    if (titleForm.info) {
        updatedFields.info = titleForm.info;
    } else if (!titleForm.info) {
        updatedFields.info = "";
    }

    try {
        const response = await titlesStore.editTitle(titleForm, updatedFields);
        // Assuming the response includes a success status or message
        if (response && response.status === 200) {
            // Assuming the response data includes the updated title details
            const updatedTitle = response.data;
            const countryName = countriesStore.getCountryNameById(
                updatedTitle.country_id
            );
            updatedTitle.country = countryName;

            // Update the title in the store
            titlesStore.updateTitle(updatedTitle);

            // Broadcast the update
            titlesStore.broadcastEdit(updatedTitle);
            // Show the success popup
            popupMessageType.value = "details_updated_successfully";
            isPopupVisible.value = true;
        } else {
            // Handle any other response that is not successful
            popupMessageType.value = "error";
            isPopupVisible.value = true;
        }
    } catch (error) {
        console.error("Υπήρξε σφάλμα στην αποστολή της φόρμας", error);
        popupMessageType.value = "error";
        isPopupVisible.value = true;
    }
};
</script>

<template>
    <div class="flex justify-center mt-12 text-blue-950">
        <div
            class="flex flex-col justify-center items-center bg-[#c4dff6] rounded-xl p-3 mt-28 border-2 border-sky-400 max-w-2xl w-full"
        >
            <div class="flex flex-wrap text-blue-950 mt-2 self-start px-3">
                <div>
                    <i
                        class="fas fa-info-circle"
                        style="margin-right: 0.5rem"
                    ></i>
                    {{ $t("update_title_details") }}
                </div>
            </div>

            <form
                @submit.prevent="submitTitleForm"
                class="flex flex-col justify-center gap-3 w-full px-3"
            >
                <hr class="border-t border-sky-400 w-full my-4 px-3" />

                <!-- Dropdown -->
                <div class="mb-4">
                    <label
                        for="new_country_id"
                        class="block text-sm font-medium mb-1"
                    >
                        {{ t("add_title_form_country") }}
                    </label>

                    <CustomDropdown
                        id="new_country_id"
                        :options="countries"
                        option-value="id"
                        option-text="country"
                        v-model="titleForm.newCountryId"
                        :placeholder="t('choose_country')"
                        required
                    />
                </div>

                <!-- Text Inputs -->
                <div class="mb-4">
                    <label
                        for="new_title"
                        class="block text-sm font-medium text-blue-950"
                    >
                        {{ t("add_title_form_title") }}
                    </label>

                    <input
                        id="new_title"
                        v-model="titleForm.newTitle"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>

                 <div class="mb-4">
                    <label for="title_type" class="block text-sm font-medium">{{
                        t("add_title_form_title_type")
                    }}</label>
                    <input
                        id="title_type"
                        v-model="titleForm.newTitleType"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>

                <!-- Submit Button -->
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
