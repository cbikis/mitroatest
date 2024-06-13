<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useCountriesStore } from "../stores/countriesStore";
import { useInstitutesStore } from "../stores/institutesStore";
import { useTitlesStore } from "../stores/titlesStore";
import { useI18n } from "vue-i18n";
import DynamicTable from "../Components/DynamicTable.vue";
import Popup from "./Utilities/Popup.vue";
import CustomDropdown from "./Utilities/CustomDropdown.vue";

// Reactive variable to determine which dataset to display
const showInstitutes = ref(null);
// const showInstitutesAsNumber = ref(null);

const { t, locale } = useI18n();

// Use the stores
const countriesStore = useCountriesStore();
const institutesStore = useInstitutesStore();
const titlesStore = useTitlesStore();
const router = useRouter();

let broadcastChannel;

// Use paginatedInstitutes instead of institutes
const currentData = computed(() => {
    return showInstitutes.value
        ? institutesStore.paginatedInstitutes
        : titlesStore.paginatedTitles;
});

const currentPage = computed(() => {
    return showInstitutes.value
        ? institutesStore.currentPage
        : titlesStore.currentPage;
});
const totalPages = computed(() => {
    return showInstitutes.value
        ? institutesStore.totalPages
        : titlesStore.totalPages;
});
const sortColumn = computed(() => {
    return showInstitutes.value
        ? institutesStore.sortColumn
        : titlesStore.sortColumn;
});
const sortDirection = computed(() => {
    return showInstitutes.value
        ? institutesStore.sortDirection
        : titlesStore.sortDirection;
});

const uniqueCountries = computed(() => {
    const instituteCountries = institutesStore.institutes.map(
        (institute) => institute.country
    );
    const titleCountries = titlesStore.titles.map((title) => title.country);
    const combinedCountries = [...instituteCountries, ...titleCountries];
    const uniqueCountrySet = new Set(combinedCountries);

    const selectAll = {id: "-1", country: t("select_all_countries_label")};
    const countries = Array.from(uniqueCountrySet).map((country) => ({
        id: country,
        country,
    }));
    const result = [selectAll, ...countries];
    return result;
});

const pageRange = 2;

const selectedCountryName = computed({
    get: () => {
        if (showInstitutes.value) {
            return institutesStore.selectedCountryName;
        } else {
            return titlesStore.selectedCountryName;
        }
    },
    set: (newValue) => {
        institutesStore.setSelectedCountryName(newValue);
        titlesStore.setSelectedCountryName(newValue);
    },
});
const showInstitutesAsNumber = computed({
    get: () => {
        showInstitutes.value = (institutesStore.selectedShowInstitutes == null || institutesStore.selectedShowInstitutes === undefined ) ? null : (institutesStore.selectedShowInstitutes === 1);
        if (showInstitutes.value) {
            return institutesStore.selectedShowInstitutes;
        } else {
            return titlesStore.selectedShowInstitutes;
        }
    },
    set: (newValue) => {
        institutesStore.setSelectedShowInstitutes(newValue);
        titlesStore.setSelectedShowInstitutes(newValue);
    }
});

const searchInstituteText = computed({
    get: () => institutesStore.searchInstituteText,
    set: (newValue) => {
        institutesStore.setSearchInstituteText(newValue);
    },
});

const searchTitleText = computed({
    get: () => titlesStore.searchTitleText,
    set: (newValue) => {
        titlesStore.setSearchTitleText(newValue);
    },
});

const searchTitleTypeText = computed({
    get: () => titlesStore.searchTitleTypeText,
    set: (newValue) => {
        titlesStore.setSearchTitleTypeText(newValue);
    },
});

const franchiseOptions = computed(() => [
    { id: "all", name: t('yes/no') },
    { id: "yes", name: t('yes') },
    { id: "no", name: t('no') },
]);

const instituteTitleOptions = computed(() => [
    { id: 1, name: t('institutes') },
    { id: 0, name: t('titles') },
]);

const instituteTypeTitleOptions = computed(() => [

    { id: 'B (6)', name:t('B (6)') },
    { id: 'B (7)', name:t('B (7)') },
    { id: 'I (7)', name:t('I (7)') },
    { id: 'D (8)', name:t('D (8)') }
]);

const franchiseFilter = computed({
    get: () => {
        return institutesStore.franchiseFilter;
    },
    set: (newValue) => {
        institutesStore.setFranchiseFilter(newValue);
    },
});

const pageLengthOptions = [
    { id: "10", name: "10" },
    { id: "25", name: "25" },
    { id: "50", name: "50" },
    { id: "100", name: "100" },
    { id: "250", name: "250" },
];

const perPage = computed({
    get: () =>
        showInstitutes.value
            ? institutesStore.perPage.toString()
            : titlesStore.perPage.toString(),
    set: (newValue) => {
        const numericValue = parseInt(newValue, 10);
        institutesStore.setPerPage(numericValue);
        titlesStore.setPerPage(numericValue);
    },
});

// Computed properties for pagination
const pages = computed(() => {
    let start = Math.max(currentPage.value - pageRange, 1);
    let end = Math.min(currentPage.value + pageRange, totalPages.value);
    let range = [];

    for (let i = start; i <= end; i++) {
        range.push(i);
    }

    return range;
});
const redirectToViewInstitute = (institutes) => {
    router.push({
        name: "view-institute",
        params: { id: institutes.id.toString() }, // Convert the id to a string if it's not already one
        query: {
            country: institutes.country_id,
            institute: institutes.institute,
            info: institutes.info,
            franchise: institutes.franchise ? "1" : "0", // Convert boolean to string
        },
    });
};

const redirectToViewTitle = (institutes) => {
  // not supported yet
};

const redirectToEditInstitute = (institutes) => {
    router.push({
        name: "edit-institute",
        params: { id: institutes.id.toString() }, // Convert the id to a string if it's not already one
        query: {
            country: institutes.country_id,
            institute: institutes.institute,
            info: institutes.info,
            franchise: institutes.franchise ? "1" : "0", // Convert boolean to string
        },
    });
};

const redirectToEditTitle = (titles) => {
    router.push({
        name: "edit-title",
        params: { id: titles.id.toString() }, // Convert the id to a string if it's not already one
        query: {
            country: titles.country_id,
            title: titles.title,
            title_type: titles.title_type,
            info: titles.info,
        },
    });
};

const isDeleteConfirmationVisible = ref(false);
const instituteToDelete = ref(null);
const titleToDelete = ref(null);

const confirmDelete = (id) => {
    if (showInstitutes.value) {
        instituteToDelete.value = id;
    } else {
        titleToDelete.value = id;
    }
    showDeleteConfirmation();
};

const deleteSelectedInstitute = async () => {
    if (instituteToDelete.value !== null) {
        await institutesStore.deleteInstitute(instituteToDelete.value);
        hideDeleteConfirmation();
        instituteToDelete.value = null;
    }
};

const deleteSelectedTitle = async () => {
    if (titleToDelete.value !== null) {
        await titlesStore.deleteTitle(titleToDelete.value);
        hideDeleteConfirmation();
        titleToDelete.value = null;
    }
};

const showDeleteConfirmation = () => {
    isDeleteConfirmationVisible.value = true;
};

const hideDeleteConfirmation = () => {
    isDeleteConfirmationVisible.value = false;
};
const handleUpdateCurrentPage = (newPage) => {
    if (showInstitutes.value) {
        institutesStore.setCurrentPage(newPage);
    } else {
        titlesStore.setCurrentPage(newPage);
    }
};

const isPopupVisible = ref(false);
const popupMessageType = ref(null); // Use null or a specific default type
const popupMessage = computed(() => {
    switch (popupMessageType.value) {
        case "select_country":
            return t("select_country");
        default:
            return ""; // Default message or condition
    }
});

const showPopup = (message) => {
    popupMessageType.value = message;
    isPopupVisible.value = true;
};

const isSwitchDisabled = computed(() => {
    return (
        selectedCountryName.value === "" || selectedCountryName.value == null
    );
});

const handleSwitchClick = (e) => {

};

onMounted(async () => {
    // Fetch all institutes at once
    await institutesStore.fetchInstitutes();
    await titlesStore.fetchTitles();

    broadcastChannel = new BroadcastChannel("institute_updates");

    broadcastChannel.onmessage = (message) => {
        if (message.data.type === "UPDATE_INSTITUTE") {
            const newInstitute = message.data.payload;
            console.log(newInstitute);
            institutesStore.addInstitute(newInstitute);
        }
    };

    broadcastChannel = new BroadcastChannel("title_updates");

    broadcastChannel.onmessage = (message) => {
        if (message.data.type === "UPDATE_TITLE") {
            const newTitle = message.data.payload;
            console.log(newTitle);
            titlesStore.addTitle(newTitle);
        }
    };

    broadcastChannel = new BroadcastChannel("country_updates");

    // Listen for messages
    broadcastChannel.onmessage = async (message) => {
        if (message.data.type === "EDIT_COUNTRY") {
            // Fetch the latest countries list from the server
            const updateCountries = message.data.payload;
            countriesStore.updateCountry(updateCountries);
        }
    };

    broadcastChannel = new BroadcastChannel("institute_edit");

    broadcastChannel.onmessage = async (message) => {
        if (message.data.type === "EDIT_INSTITUTE") {
            institutesStore.updateInstitute(message.data.payload);
        }
    };

    broadcastChannel = new BroadcastChannel("title_edit");

    broadcastChannel.onmessage = async (message) => {
        if (message.data.type === "EDIT_TITLE") {
            titlesStore.updateTitle(message.data.payload);
        }
    };

    broadcastChannel = new BroadcastChannel("country_deletions");

    broadcastChannel.onmessage = async (message) => {
        if (message.data.type === "DELETE_COUNTRY") {
            console.log("This is the: ", message.data.payload);
            countriesStore.deleteCountry(message.data.payload);
            institutesStore.deleteInstitutesByCountryId(message.data.payload);
            titlesStore.deleteTitlesByCountryId(message.data.payload);
        }
    };
});

onUnmounted(() => {
    // Clean up the channel when the component is unmounted
    broadcastChannel.close();
});

watch(showInstitutes, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        // Reset the delete confirmation popup visibility
        isDeleteConfirmationVisible.value = false;
        // Also reset the selected items to delete
        instituteToDelete.value = null;
        titleToDelete.value = null;
     
        showInstitutesAsNumber.value = newValue == true ? 1 : newValue == false ? 0 : null;
    }
});


const switchToTitles = (country) => {
    // Set the selected country for the titles table
    titlesStore.setSelectedCountryName(country);
    institutesStore.setSelectedCountryName(country);
    // Toggle the showInstitutes to switch the table
    showInstitutes.value = !showInstitutes.value;
};

const isShowInstitutesVisible = () => {
    return showInstitutes.value === true;
}

const isShowTitlesVisible = () => {
    return showInstitutes.value === false;
}

const clearFilters = () => {
    // Reset filters for institutes
    institutesStore.setSelectedCountryName(null);
    institutesStore.setSearchInstituteText("");
    institutesStore.setFranchiseFilter("all");
    institutesStore.setCurrentPage(1); // Reset to the first page

    // Reset filters for titles
    titlesStore.setSelectedCountryName(null);
    titlesStore.setSearchTitleText("");
    titlesStore.setSearchTitleTypeText("");
    titlesStore.setCurrentPage(1); // Reset to the first page

    showInstitutes.value = null;
    showInstitutesAsNumber.value = null;
    institutesStore.setSelectedShowInstitutes(null);
    titlesStore.setSelectedShowInstitutes(null);
};
</script>

<template>




<div class="flex flex-col items-center justify-center">
    


    <div class="container mx-auto p-4 bg-white rounded-lg shadow-md">
        <!-- Form Section -->
        <div class="bg-[#77b6ea] p-4 rounded-lg mb-6 mt-32">
            <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- <div>
                    <label class="block font-bold mb-2" for="country">ΧΩΡΑ</label>
                    <div class="relative">
                        <select id="country" class="block appearance-none w-full bg-white border border-gray-300 py-2 px-3 pr-8 rounded leading-tight focus:outline-none">
                            <option>AFGHANISTAN</option>
                            <option>ALBANIA</option>
                            <option>ALGERIA</option>
                        </select>
                    </div>
                </div> -->
                <div>
                    <label class="block font-bold mb-2 text-blue-800" for="search_country_name"
                    >
                        {{ $t("country") }}
                    </label>
                    <div class="relative">
                        <CustomDropdown
                            id="search_country_name"
                            :options="uniqueCountries"
                            option-value="id"
                            option-text="country"
                            v-model="selectedCountryName"
                            :placeholder="$t('choose_country')"
                            required
                        />
                    </div>
                </div>
                







                <!-- <div>
                    <label class="block font-bold mb-2" for="nationalRegistry">ΕΘΝΙΚΑ ΜΗΤΡΩΑ</label>
                    <div class="relative">
                        <select id="nationalRegistry" class="block appearance-none w-full bg-white border border-gray-300 py-2 px-3 pr-8 rounded leading-tight focus:outline-none">
                            <option>ΠΑΝΕΠΙΣΤΗΜΙΑ</option>
                            <option>ΣΧΟΛΕΣ</option>
                        </select>
                    </div>
                </div> -->
<!-- Switch Button Container -->
                <div>
                    <label class="block font-bold mb-2 text-blue-800" for="nationalRegistry"> {{ $t("national_registries") }} </label>
                    <div class="relative" @click="handleSwitchClick">
                        <CustomDropdown
                        id="instituteTitleOptionsId"
                        :read-οnly="isSwitchDisabled"
                        :options="instituteTitleOptions"
                        option-value="id"
                        option-text="name"
                        v-model="showInstitutesAsNumber"
                        :placeholder="$t('please_select_national_registry')" />
                    </div>
                </div>
        

                <div v-if="isShowInstitutesVisible()">
                    <label class="block font-bold mb-2 text-blue-800" for="university"> {{ $t("institute") }}</label>
                    <input
                            id="name"
                            autocomplete="off"
                            class="w-full bg-white border border-gray-300 py-2 px-3 rounded leading-tight focus:outline-none"
                            name="name"
                            type="text"
                            v-model="searchInstituteText"/>
                </div>
                <div v-else-if="isShowTitlesVisible()">
                    <label class="block font-bold mb-2 text-blue-800" for="name"> {{ $t("title") }}</label>
                    <input
                            id="name"
                            autocomplete="off"
                            class="w-full bg-white border border-gray-300 py-2 px-3 rounded leading-tight focus:outline-none"
                            name="name"
                            type="text"
                            v-model="searchTitleText"/>
                </div>

                <div  v-if="isShowInstitutesVisible()">
                    <label class="block font-bold mb-2 text-blue-800" for="franchise"> {{ $t("franchise") }}</label>
                    <div class="relative">
                        <CustomDropdown
                            id="franchise"
                            :options="franchiseOptions"
                            option-value="id"
                            option-text="name"
                            v-model="franchiseFilter"
                            placeholder="Επιλέξτε"
                        />
                    </div>
                </div>
                <div v-else-if="isShowTitlesVisible()">
                    <label class="block font-bold mb-2 text-blue-800" for="name"> {{ $t("title_type") }}</label>
                    <div class="relative">
                        <CustomDropdown
                            id="TitleOptionsId"
                            :options="instituteTypeTitleOptions"
                            option-value="id"
                            option-text="name"
                            v-model="searchTitleTypeText"
                            :placeholder="$t('please_select_type_title')"
                        />
                    </div>
                </div>



                <div class="col-span-1 md:col-span-2 flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <label class="font-bold text-blue-800" for="resultsPerPage">{{ $t("results_per_page") }}</label>
                        <CustomDropdown
                            :options="pageLengthOptions"
                            :width-class="'w-16'"
                            option-value="id"
                            option-text="name"
                            v-model="perPage"/>
                    </div>
                    <button type="reset" class="bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 border-sky-400 border-2 py-2 px-4 rounded"  @click="clearFilters">
                        <i class="fas fa-broom mr-2"></i>{{ $t("clear") }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Table Section -->
        <div v-if="showInstitutes">
            <DynamicTable
                :data="currentData"
                :sortColumn="sortColumn"
                :sortDirection="sortDirection"
                :sortTable="
                    showInstitutes
                        ? institutesStore.sortTable
                        : titlesStore.sortTable
                "
                
                :redirectToView="
                    showInstitutes
                        ? redirectToViewInstitute
                        : ''
                "

                :redirectToEdit="
                    showInstitutes
                        ? redirectToEditInstitute
                        : redirectToEditTitle
                "
                :confirmDelete="confirmDelete"
                :currentPage="currentPage"
                :totalPages="totalPages"
                :pages="pages"
                :showInstitutes="showInstitutes"
                :isDeleteConfirmationVisible="isDeleteConfirmationVisible"
                @update:currentPage="handleUpdateCurrentPage"
                @confirmDelete="confirmDelete"
                @deleteSelectedInstitute="deleteSelectedInstitute"
                @deleteSelectedTitle="deleteSelectedTitle"
                @update:isDeleteConfirmationVisible="
                    isDeleteConfirmationVisible = $event
                "
                @certificateClick="switchToTitles"
            />
        </div>
        <div v-else>
            <DynamicTable
                :data="currentData"
                :sortColumn="sortColumn"
                :sortDirection="sortDirection"
                :sortTable="
                    showInstitutes
                        ? institutesStore.sortTable
                        : titlesStore.sortTable
                "
                :redirectToEdit="
                    showInstitutes
                        ? redirectToEditInstitute
                        : redirectToEditTitle
                "
                :confirmDelete="confirmDelete"
                :currentPage="currentPage"
                :totalPages="totalPages"
                :pages="pages"
                :showInstitutes="showInstitutes"
                :isDeleteConfirmationVisible="isDeleteConfirmationVisible"
                @update:currentPage="handleUpdateCurrentPage"
                @confirmDelete="confirmDelete"
                @deleteSelectedInstitute="deleteSelectedInstitute"
                @deleteSelectedTitle="deleteSelectedTitle"
                @update:isDeleteConfirmationVisible="
                    isDeleteConfirmationVisible = $event
                "
            />
        </div>
</div>
</div>

</template>
