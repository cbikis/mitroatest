<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useCountriesStore } from "../../stores/countriesStore";
import { useInstitutesStore } from "../../stores/institutesStore";
import { useTitlesStore } from "../../stores/titlesStore";
import CustomDropdown from "../Utilities/CustomDropdown.vue";
import Popup from "../Utilities/Popup.vue";
import { useI18n } from "vue-i18n"; // Import the useI18n hook

const { t } = useI18n();

const countriesStore = useCountriesStore(); // Use the store

const countries = computed(() => countriesStore.countries);
const institutesStore = useInstitutesStore();
const titlesStore = useTitlesStore();

const isPopupVisible = ref(false);
const popupMessageType = ref(null); // Use null or a specific default type
const popupMessage = computed(() => {
    switch (popupMessageType.value) {
        case "emptyInput":
            return t("please_select_a_country");
        case "countryExists":
            return t("country_already_exists");
        case "emptyNewInput":
            return t("please_input_new_country_name");
        case "details_updated_successfully":
            return t("details_updated_successfully");
        case "success":
            return t("country_added_successfully");
        case "error":
            return t("error_submitting_form");
        default:
            return ""; // Default message or condition
    }
});

const countryForm = reactive({
    selectedCountryId: "",
    selectedCountryName: "",
    newCountryName: "",
});

const submitCountryForm = async () => {
    if (!countryForm.selectedCountryId) {
        // If the input field is empty, show a message in the popup
        popupMessageType.value = "emptyInput";
        isPopupVisible.value = true;
        return; // Exit the function early
    } else if (!countryForm.newCountryName.trim()) {
        popupMessageType.value = "emptyNewInput";
        isPopupVisible.value = true;
        return; // Exit the function early
    }

    // Convert the submitted country name to uppercase
    const submittedCountryName = countryForm.newCountryName.toUpperCase();

    // Check if the country already exists in the list
    const countryExists = countries.value.some(
        (country) => country.country.toUpperCase() === submittedCountryName
    );

    if (countryExists) {
        popupMessageType.value = "countryExists";
        isPopupVisible.value = true;
        return; // Exit the function early
    }

    try {
        const oldCountryName = countriesStore.getCountryNameById(
            countryForm.selectedCountryId
        );
        const response = await countriesStore.editCountry(
            countryForm.selectedCountryId,
            { country: countryForm.newCountryName.toUpperCase() }
        );
        const updatedCountry = {
            id: countryForm.selectedCountryId,
            country: countryForm.newCountryName,
        };
        institutesStore.updateCountryNameInInstitutes(
            oldCountryName,
            submittedCountryName
        );
        titlesStore.updateCountryNameInTitles(
            oldCountryName,
            submittedCountryName
        );
        // Broadcast the update
        countriesStore.updateCountry(updatedCountry);
        countriesStore.broadcastUpdate(updatedCountry);
        popupMessageType.value = "details_updated_successfully";
        isPopupVisible.value = true;
    } catch (error) {
        console.error("Υπήρξε σφάλμα στην αποστολή της φόρμας", error);
        popupMessageType.value = "error";
        isPopupVisible.value = true;
    }
};

const showPopup = (message) => {
    popupMessage.value = message;
    isPopupVisible.value = true;
};

onMounted(async () => {
    countriesStore.fetchCountries();
});
</script>

<template>
    <div class="flex justify-center mt-12 text-blue-950">
        <div
            class="flex flex-col justify-center items-center bg-[#c4dff6] rounded-xl p-3 mt-28 border-2 border-sky-400 max-w-2xl w-full"
        >
            <div class="flex flex-wrap mt-2 self-start px-3">
                <div>
                    <i
                        class="fas fa-info-circle"
                        style="margin-right: 0.5rem"
                    ></i>
                    {{ $t("update_country_details") }}
                </div>
            </div>

            <!-- Form -->
            <form
                @submit.prevent="submitCountryForm"
                class="flex flex-col justify-center gap-3 w-full px-3"
            >
                <hr class="border-t border-sky-400 w-full my-4 px-3" />

                <!-- Dropdown -->
                <div class="mb-4">
                    <label
                        for="country_select"
                        class="block text-sm font-medium mb-1"
                    >
                        {{ $t("existing_country") }}
                    </label>

                    <CustomDropdown
                        id="country_select"
                        :options="countries"
                        option-value="id"
                        option-text="country"
                        v-model="countryForm.selectedCountryId"
                        :placeholder="t('choose_country')"
                    />
                </div>

                <!-- Text Input -->
                <div class="mb-4">
                    <label
                        for="new_country_name"
                        class="block text-sm font-medium text-blue-950"
                    >
                        {{ $t("new_country_name") }}
                    </label>

                    <input
                        id="new_country_name"
                        v-model="countryForm.newCountryName"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>

                <!-- Submit Button -->
                <button
                    class="px-4 py-2 bg-[#77b6ea] rounded-md hover:bg-sky-500 self-end"
                    type="submit"
                >
                    <i class="fas fa-save" style="margin-right: 0.5rem"></i>
                    {{ $t("save") }}
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
