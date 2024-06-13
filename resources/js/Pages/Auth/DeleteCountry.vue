<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import { useCountriesStore } from "../../stores/countriesStore";
import Popup from "../Utilities/Popup.vue";
import CustomDropdown from "../Utilities/CustomDropdown.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const countriesStore = useCountriesStore(); // Use the Pinia store
const countries = computed(() => countriesStore.countries);

const countryForm = reactive({
    selectedCountryId: null,
});

const isPopupVisible = ref(false);
const popupMessageType = ref(null);

const popupMessage = computed(() => {
    switch (popupMessageType.value) {
        case "emptyInput":
            return t("please_select_a_country");
        case "countryDeleted":
            return t("country_deleted_successfully");
        case "error":
            return t("error_submitting_form");
        default:
            return "";
    }
});

const deleteCountry = async () => {
    if (!countryForm.selectedCountryId) {
        popupMessageType.value = "emptyInput";
        isPopupVisible.value = true;
        return;
    }

    try {
        await countriesStore.deleteCountry(countryForm.selectedCountryId);
        popupMessageType.value = "countryDeleted";
        isPopupVisible.value = true;
        countryForm.selectedCountryId = null; // Reset the selected country ID
    } catch (error) {
        console.error("There was an error deleting the country:", error);
        popupMessageType.value = "error";
        isPopupVisible.value = true;
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
            <div class="flex flex-wrap mt-2 self-start px-3">
                <div>
                    <i
                        class="fas fa-info-circle"
                        style="margin-right: 0.5rem"
                    ></i>
                    {{ $t("delete_country_form_title") }}
                </div>
            </div>

            <!-- Form -->
            <form
                @submit.prevent="deleteCountry"
                class="flex flex-col justify-center gap-3 w-full px-3"
            >
                <hr class="border-t border-sky-400 w-full my-4 px-3" />

                <div class="mb-4">
                    <label
                        for="country_select"
                        class="block text-sm font-medium mb-1"
                    >
                        {{ $t("add_title_form_country") }}
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

                <!-- Submit Button -->
                <button
                    class="px-4 py-2 bg-[#77b6ea] rounded-md hover:bg-sky-500 self-end"
                    type="submit"
                >
                    <i class="fas fa-save" style="margin-right: 0.5rem"></i>
                    {{ $t("delete") }}
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
