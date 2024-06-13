<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useCountriesStore } from "../stores/countriesStore";
import { useInstitutesStore } from "../stores/institutesStore";
import CustomDropdown from "./Utilities/CustomDropdown.vue";
import Popup from "./Utilities/Popup.vue";
import { useI18n } from "vue-i18n"; // Import the useI18n hook

const { t } = useI18n();

// Define the props that this component will accept
const route = useRoute();
const countriesStore = useCountriesStore(); // Use the store
const institutesStore = useInstitutesStore(); // Use the institutes store
const countries = computed(() => countriesStore.countries);

const instituteForm = reactive({
    institute_id: Number(route.params.id),
    newCountryId: Number(route.query.country),
    newInstitute: route.query.institute,
    newUrl: "",
    newInstituteOriginal: "",
    newInstituteEl: "",
    newInstituteOld1: "",
    newInstituteOld2: "",
    info: route.query.info,
    franchise: route.query.franchise === "1",
});

const isPopupVisible = ref(false);
const popupMessageType = ref(null); // Use null or a specific default type
const popupMessage = computed(() => {
    switch (popupMessageType.value) {
        case "emptyInstituteInput":
            return t("please_input_institite_name");
        case "sameInstituteInput":
            return t("same_institute_already_exists");
        case "details_updated_successfully":
            return t("details_updated_successfully");
        case "problem_updating_details":
            return t("error_submitting_form");
        case "error":
            return t("error_submitting_form");
        default:
            return ""; // Default message or condition
    }
});

onMounted(async () => {
    countriesStore.fetchCountries();
    await institutesStore.fetchInstitutes(); // Use the store's action

    const institutes = institutesStore.institutes;

    const instituteData = institutes.filter(
        (institute) => institute.country_id === instituteForm.newCountryId && institute.institute === instituteForm.newInstitute
        )[0];
    console.log(instituteData);
    if (instituteData) {
        instituteForm.newUrl = instituteData.url;  // assuming the fetched data has 'url'
        instituteForm.newInstituteOriginal = instituteData.institute_original;
        instituteForm.newInstituteEl = instituteData.institute_el;
        instituteForm.newInstituteOld1 = instituteData.institute_old_1;
        instituteForm.newInstituteOld2 = instituteData.institute_old_2;
    }
});

const submitInstituteForm = async () => {
    // Fetch all institutes with the same country ID as the newCountryId
    const institutesInSameCountry = institutesStore.institutes.filter(
        (institute) => institute.country_id === instituteForm.newCountryId
    );

    // Check if an institute with the same name and franchise status already exists
    const instituteExists = institutesInSameCountry.some(
        (institute) =>
            institute.institute === instituteForm.newInstitute &&
            institute.franchise == instituteForm.franchise &&
            institute.info === instituteForm.info && 
            institute.url === instituteForm.newUrl && 
            institute.institute_original === instituteForm.newInstituteOriginal && 
            institute.institute_el === instituteForm.newInstituteEl &&
            institute.institute_old_1 === instituteForm.newInstituteOld1 && 
            institute.institute_old_2 === instituteForm.newInstituteOld2
    );

    if (instituteExists) {
        showPopup("sameInstituteInput");
        return;
    }

    const updatedFields = {};
    if (instituteForm.newCountryId)
        updatedFields.newCountryId = instituteForm.newCountryId;
    if (instituteForm.newInstitute)
        updatedFields.newInstitute = instituteForm.newInstitute;
    else if ((instituteForm.newInstitute = "")) {
        showPopup("emptyInstituteInput");
        return;
    }
    if (instituteForm.info) {
        updatedFields.info = instituteForm.info;
    } else if (!instituteForm.info) {
        updatedFields.info = "";
    }

    updatedFields.newUrl =  instituteForm.newUrl ? instituteForm.newUrl : "";
    updatedFields.newInstituteOriginal =  instituteForm.newInstituteOriginal ? instituteForm.newInstituteOriginal : "";
    updatedFields.newInstituteEl =  instituteForm.newInstituteEl ? instituteForm.newInstituteEl : "";
    updatedFields.newInstituteOld1 =  instituteForm.newInstituteOld1 ? instituteForm.newInstituteOld1 : "";
    updatedFields.newInstituteOld2 =  instituteForm.newInstituteOld2 ? instituteForm.newInstituteOld2 : "";

    console.log(instituteForm.info);
    updatedFields.franchise = instituteForm.franchise;

    try {
        const response = await institutesStore.editInstitute(
            instituteForm,
            updatedFields
        );
        if (response && response.status === 200) {
            // Assuming the response data includes the updated institute details
            const updatedInstitute = response.data;
            const countryName = countriesStore.getCountryNameById(
                updatedInstitute.country_id
            );
            updatedInstitute.country = countryName;

            // Update the institute in the store
            institutesStore.updateInstitute(updatedInstitute);

            // Broadcast the update
            institutesStore.broadcastEdit(updatedInstitute);

            // Show the success popup
            showPopup("details_updated_successfully");
        } else {
            // Handle any other response that is not successful
            showPopup("problem_updating_details");
        }
    } catch (error) {
        console.error("Υπήρξε σφάλμα στην αποστολή της φόρμας", error);
        showPopup("error");
    }
};

const showPopup = (message) => {
    popupMessageType.value = message;
    isPopupVisible.value = true;
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
                    {{ $t("view_institute_details") }}
                </div>
            </div>
            <form
                @submit.prevent="submitInstituteForm"
                class="flex flex-col justify-center gap-3 w-full px-3"
            >
                <hr class="border-t border-white w-full my-4 px-3" />
                <!-- Dropdown to select the new country -->
                <div class="mb-4">
                    <label
                        for="new_country_id"
                        class="block text-sm font-medium mb-1"
                        >{{ $t("add_institute_form_country") }}</label
                    >
                    <CustomDropdown
                        id="new_country_id"
                        :options="countries"
                        option-value="id"
                        option-text="country"
                        v-model="instituteForm.newCountryId"
                        :placeholder="$t('choose_country')"
                        read-only="true"
                        required
                    />
                </div>

                <!-- Input for new institute name -->
                <div class="mb-4 w-full">
                    <label
                        for="new_institute"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute") }}</label
                    >
                    <input
                        id="new_institute"
                        v-model="instituteForm.newInstitute"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        disabled="true"
                    />
                </div>

                <!-- Input for new institute original name -->
                <div class="mb-4 w-full">
                    <label
                        for="new_institute_original"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute_original") }}</label
                    >
                    <input
                        id="new_institute_original"
                        v-model="instituteForm.newInstituteOriginal"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        disabled="true"
                        />
                </div>

                <!-- Input for new institute greek name -->
                <div class="mb-4 w-full">
                    <label
                        for="new_institute_el"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute_el") }}</label
                    >
                    <input
                        id="new_institute_el"
                        v-model="instituteForm.newInstituteEl"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        disabled="true"
                    />
                </div>

                  <!-- Input for old institute 1 name -->
                <div class="mb-4 w-full">
                    <label
                        for="new_institute_old_1"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute_old_institute_1") }}</label
                    >
                    <input
                        id="new_institute_old_1"
                        v-model="instituteForm.newInstituteOld1"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        disabled="true"
                    />
                </div>
                <!-- Input for old institute 2 name -->
                <div class="mb-4 w-full">
                    <label
                        for="new_institute_old_2"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute_old_institute_2") }}</label
                    >
                    <input
                        id="new_institute_old_2"
                        v-model="instituteForm.newInstituteOld2"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        disabled="true"
                    />
                </div>
                

                <!-- Input for new url -->
                <div class="mb-4 w-full">
                    <label
                        for="new_url"
                        class="block text-sm font-medium"
                        >{{ $t("add_institute_form_institute_url") }}</label
                    >
                    <input
                        id="new_url"
                        v-model="instituteForm.newUrl"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        disabled="true"
                    />
                </div>

                <!-- Input for additional information -->
                <div class="mb-4 w-full">
                    <label for="info" class="block text-sm font-medium">{{
                        $t("add_institute_form_information")
                    }}</label>
                    <input
                        id="info"
                        v-model="instituteForm.info"
                        type="text"
                        class="mt-1 block w-full py-2 px-3 text-blue-950 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-gray-500"
                        disabled="true"
                    />
                </div>

                <!-- Checkbox for Franchise -->
                <div class="mb-6 self-center">
                    <label for="franchise" class="flex items-center">
                        <input
                            id="franchise"
                            v-model="instituteForm.franchise"
                            type="checkbox"
                            class="h-4 w-4 rounded"
                            disabled="true"
                        />
                        <span class="ml-2 text-sm">{{
                            $t("add_institute_form_franchise")
                        }}</span>
                    </label>
                </div>
            </form>
        </div>
        <Popup
            :message="popupMessage"
            :isVisible="isPopupVisible"
            @update:isVisible="isPopupVisible = $event"
        />
    </div>
</template>
