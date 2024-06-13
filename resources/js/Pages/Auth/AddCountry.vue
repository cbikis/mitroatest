<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import { useCountriesStore } from "../../stores/countriesStore";
import Popup from "../Utilities/Popup.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const countriesStore = useCountriesStore(); // Use the Pinia store
const countries = computed(() => countriesStore.countries);

const countryForm = reactive({
    country: "",
});

const isPopupVisible = ref(false);
const popupMessageType = ref(null); // Use null or a specific default type
const popupMessage = computed(() => {
    switch (popupMessageType.value) {
        case "emptyInput":
            return t("please_select_a_country");
        case "countryExists":
            return t("country_already_exists");
        case "country_added_successfully":
            return t("country_added_successfully");
        case "error":
            return t("error_submitting_form");
        default:
            return ""; // Default message or condition
    }
});

const submitCountryForm = async () => {
    // Check if the input field is empty
    if (!countryForm.country) {
        // If the input field is empty, show a message in the popup
        popupMessageType.value = "emptyInput";
        isPopupVisible.value = true;
        return; // Exit the function early
    }

    // Convert the submitted country name to uppercase
    const submittedCountryName = countryForm.country.toUpperCase();

    // Check if the country already exists in the list
    const countryExists = countries.value.some(
        (country) => country.country.toUpperCase() === submittedCountryName
    );

    if (countryExists) {
        // If the country exists, show an error message in the popup
        popupMessageType.value = "countryExists";
        isPopupVisible.value = true;
    } else {
        // If the country does not exist, proceed with the submission
        try {
            const response = await axios.post("/api/add-country", {
                country: submittedCountryName,
            });
            // Handle success
            popupMessageType.value = "country_added_successfully";
            isPopupVisible.value = true;
            countryForm.country = ""; // Clear the form after submission
            countriesStore.addCountry(response.data); // Add the new country to the store
            countriesStore.broadcastUpdate(response.data); // Broadcast the update
        } catch (error) {
            console.error("Υπήρξε ένα σφάλμα στην αποστολή της φόρμας", error);
            // Handle error
            popupMessageType.value = "error";
            isPopupVisible.value = true;
        }
    }
};

onMounted(async () => {
    await countriesStore.fetchCountries();
});
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
                    ></i
                    >{{ $t("add_country_form_add_country") }}
                </div>
            </div>
            <!-- Country Form -->
            <form
                @submit.prevent="submitCountryForm"
                class="flex flex-col justify-center gap-3 w-full px-3"
            >
                <hr class="border-t border-white w-full my-4 px-3" />
                <div class="mb-4">
                    <label
                        for="country"
                        class="block text-sm font-medium mb-1"
                        >{{ $t("add_country_form_country_name") }}</label
                    >
                    <input
                        id="country"
                        v-model="countryForm.country"
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
