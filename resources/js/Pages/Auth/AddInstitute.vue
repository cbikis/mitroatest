<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import { useCountriesStore } from "../../stores/countriesStore";
import { useInstitutesStore } from "../../../js/stores/institutesStore";
import Popup from "../Utilities/Popup.vue";
import CustomDropdown from "../Utilities/CustomDropdown.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const institutesStore = useInstitutesStore(); // Use the Pinia store
const countriesStore = useCountriesStore(); // Use the Pinia store
const countries = computed(() => countriesStore.countries);

const instituteForm = reactive({
    country_id: "",
    institute: "",
    url: "",
    institute_original: "",
    institute_el: "",
    institute_old_1: "",
    institute_old_2: "",
    info: "",
    franchise: false,
});

const isPopupVisible = ref(false);
const popupMessageType = ref(null); // Use null or a specific default type
const popupMessage = computed(() => {
    switch (popupMessageType.value) {
        case "emptyInput":
            return t("please_select_country_and_institute");
        case "emptyCountryInput":
            return t("please_select_a_country");
        case "emptyInstituteInput":
            return t("please_input_institite_name");
        case "instituteExistsFranchise":
            return t("institute_already_exists_in_franchise_list");
        case "instituteExistsRecognized":
            return t("institute_already_exists_recognized");
        case "instituteAddedSuccessfully":
            return t("institute_added_successfully");
        case "error":
            return t("error_submitting_form");
        default:
            return ""; // Default message or condition
    }
});

onMounted(async () => {
    await countriesStore.fetchCountries();
    await institutesStore.fetchInstitutes(); // Use the store's action
});

const submitInstituteForm = async () => {
    // Check if the country_id or institute fields are empty and show a popup message
    if (!instituteForm.country_id && !instituteForm.institute) {
        popupMessageType.value = "emptyInput";
        isPopupVisible.value = true;
        return; // Stop the function execution
    } else if (!instituteForm.country_id) {
        popupMessageType.value = "emptyCountryInput";
        isPopupVisible.value = true;
        return; // Stop the function execution
    } else if (!instituteForm.institute) {
        popupMessageType.value = "emptyInstituteInput";
        isPopupVisible.value = true;
        return; // Stop the function execution
    }

    // Convert the submitted institute name to uppercase
    const submittedInstituteName = instituteForm.institute.toUpperCase();

    // Find if the institute already exists and matches the franchise status
    const matchingInstitute = institutesStore.institutes.find(
        (institute) =>
            institute.country_id === instituteForm.country_id &&
            institute.institute.toUpperCase() === submittedInstituteName &&
            institute.franchise == instituteForm.franchise
    );

    if (matchingInstitute) {
        // If the institute exists and the franchise status matches, show an error message in the popup
        popupMessageType.value = instituteForm.franchise
            ? "instituteExistsFranchise"
            : "instituteExistsRecognized";

        isPopupVisible.value = true;
    } else {
        // If the institute does not exist, proceed with the submission
        try {
            const response = await axios.post(
                "/api/add-foreign-institute",
                instituteForm
            );
            // Handle success
            popupMessageType.value = "instituteAddedSuccessfully";
            isPopupVisible.value = true;
            // Clear the form or other success actions
            instituteForm.country_id = "";
            instituteForm.institute = "";
            instituteForm.info = "";
            instituteForm.franchise = false;
            instituteForm.url = "";
            instituteForm.institute_el = "";
            instituteForm.institute_original = "";
            instituteForm.institute_old_1 = "";
            instituteForm.institute_old_2 = "";

            console.log(response.data);
            // Add the new institute to the store
            institutesStore.addInstitute(response.data);
            institutesStore.broadcastUpdate(response.data); // Broadcast the update to other tabs
        } catch (error) {
            // Handle error
            console.error("Υπήρξε ένα σφάλμα στην αποστολή της φόρμας", error);
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
                    ></i
                    >{{ $t("add_institute_form_add_institute") }}
                </div>
            </div>
            <form
                @submit.prevent="submitInstituteForm"
                class="flex flex-col justify-center gap-3 w-full px-3"
            >
                <hr class="border-t border-white w-full my-4 px-3" />
                <div class="mb-4">
                    <label
                        for="country_id"
                        class="block text-sm font-medium mb-1"
                        >{{ $t("add_institute_form_country") }}</label
                    >
                    <CustomDropdown
                        id="country_id"
                        :options="countries"
                        option-value="id"
                        option-text="country"
                        v-model="instituteForm.country_id"
                        :placeholder="$t('choose_country')"
                    />
                </div>

                <div class="mb-4">
                    <label for="institute" class="block text-sm font-medium">{{
                        $t("add_institute_form_institute")
                    }}</label>
                    <input
                        id="institute"
                        v-model="instituteForm.institute"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>


                
                <!-- Input for new institute original name -->
                <div class="mb-4 w-full">
                    <label
                        for="institute_original"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute_original") }}</label
                    >
                    <input
                        id="institute_original"
                        v-model="instituteForm.institute_original"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky -500"
                    />
                </div>

                <!-- Input for new institute greek name -->
                <div class="mb-4 w-full">
                    <label
                        for="institute_el"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute_el") }}</label
                    >
                    <input
                        id="institute_el"
                        v-model="instituteForm.institute_el"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky -500"
                    />
                </div>

                <!-- Input for old university name -->
                <div class="mb-4 w-full">
                    <label
                        for="institute_old_1"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute_old_institute_1") }}</label
                    >
                    <input
                        id="institute_old_1"
                        v-model="instituteForm.institute_old_1"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky -500"
                    />
                </div>

                   <!-- Input for old university name 2 -->
                   <div class="mb-4 w-full">
                    <label
                        for="institute_old_2"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute_old_institute_2") }}</label
                    >
                    <input
                        id="institute_old_2"
                        v-model="instituteForm.institute_old_2"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky -500"
                    />
                </div>

                <!-- Input for new url -->
                <div class="mb-4 w-full">
                    <label
                        for="url"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute_url") }}</label
                    >
                    <input
                        id="url"
                        v-model="instituteForm.url"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky -500"
                    />
                </div>


                <div class="mb-4">
                    <label for="info" class="block text-sm font-medium">{{
                        $t("add_institute_form_information")
                    }}</label>
                    <input
                        id="info"
                        v-model="instituteForm.info"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>

                <div class="mb-6 self-center">
                    <label for="franchise" class="flex items-center">
                        <input
                            id="franchise"
                            v-model="instituteForm.franchise"
                            type="checkbox"
                            class="h-4 w-4 text-blue-950 border-sky-400 rounded"
                        />
                        <span class="ml-2 text-sm">{{
                            $t("add_institute_form_franchise")
                        }}</span>
                    </label>
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
