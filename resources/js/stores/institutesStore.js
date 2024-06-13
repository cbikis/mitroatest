import { defineStore } from "pinia";
import axios from "axios";

export const useInstitutesStore = defineStore("institutes", {
    state: () => ({
        institutes: [],
        currentPage: 1,
        perPage: 5,
        sortColumn: null,
        sortDirection: "asc",
        searchId: "",
        selectedCountryName: null,
        selectedShowInstitutes: null,
        showData: false,
        searchInstituteText: "",
        franchiseFilter: "all",
    }),
    getters: {
        filteredInstitutes: (state) => {
            return state.institutes.filter((institute) => {
                const matchesId = state.searchId
                    ? institute.id.toString().startsWith(state.searchId)
                    : true;
                const matchesCountry = state.selectedCountryName && state.selectedCountryName !== "-1" // -1 means display everything as a choice
                    ? institute.country.toLowerCase() ===
                      state.selectedCountryName.toLowerCase()
                    : true;

                // institute text should match the original, greek and english translation
                const matchesInstituteText = state.searchInstituteText
                    ? [institute.institute, institute.institute_el, institute.institute_original]
                          .filter(value => value !== null && value !== undefined)
                          .map(value => value.toLowerCase()) // Convert each value to lowercase
                          .some(value => value.includes(state.searchInstituteText.toLowerCase()))
                    : true;
                let matchesFranchise = true;
                if (state.franchiseFilter === "yes") {
                    matchesFranchise = institute.franchise === 1;
                } else if (state.franchiseFilter === "no") {
                    matchesFranchise = institute.franchise === 0;
                }
                return (
                    matchesId &&
                    matchesCountry &&
                    matchesInstituteText &&
                    matchesFranchise
                );
            });
        },
        paginatedInstitutes() {
            // Use filteredInstitutes for pagination
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredInstitutes.slice(start, end);
        },
        totalPages() {
            // Calculate total pages based on filteredInstitutes
            return Math.ceil(this.filteredInstitutes.length / this.perPage);
        },
    },
    actions: {
        // Broadcast a message to other tabs
        broadcastUpdate(newInstitute) {
            const channel = new BroadcastChannel("institute_updates");
            channel.postMessage({
                type: "UPDATE_INSTITUTE",
                payload: newInstitute,
            });
            channel.close();
        },

        broadcastEdit(updatedInstitute) {
            const channel = new BroadcastChannel("institute_edit");
            channel.postMessage({
                type: "EDIT_INSTITUTE",
                payload: updatedInstitute,
            });
            channel.close();
        },
        broadcastLoadInstitutes(institutes) {
            const channel = new BroadcastChannel("institutes_loaded");
            channel.postMessage({
                type: "LOAD_INSTITUTES",
                payload: institutes,
            });
            channel.close();
        },
        async editInstitute(instituteForm, updatedFields) {
            const response = await axios.put(
                `/api/edit-foreign-institute/${instituteForm.institute_id}`,
                updatedFields
            );
            return response;
        },

        async fetchInstitutes(forceRefresh = false) {
            if (this.institutes.length === 0 || forceRefresh) {
                try {
                    const response = await axios.get("/api/foreign-institutes");
                    this.institutes = response.data; // Assuming the API returns the data array directly
                } catch (error) {
                    console.error("Error fetching institutes:", error);
                }
            }
        },
        sortTable(column) {
            if (this.sortColumn === column) {
                this.sortDirection =
                    this.sortDirection === "asc" ? "desc" : "asc";
            } else {
                this.sortColumn = column;
                this.sortDirection = "asc";
            }

            this.institutes.sort((a, b) => {
                let aValue = a[column];
                let bValue = b[column];

                if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
                    aValue = Number(aValue);
                    bValue = Number(bValue);
                } else {
                    aValue =
                        aValue !== null && aValue !== undefined
                            ? aValue.toString().trim()
                            : "";
                    bValue =
                        bValue !== null && bValue !== undefined
                            ? bValue.toString().trim()
                            : "";
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return this.sortDirection === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return this.sortDirection === "asc" ? 1 : -1;
                }
                return 0;
            });

            this.currentPage = 1;
        },
        setCurrentPage(page) {
            this.currentPage = page;
        },
        setSearchId(searchId) {
            // Action to update searchId and reset pagination
            this.searchId = searchId;
            this.setCurrentPage(1);
        },
        setSelectedCountryName(countryName) {
            this.selectedCountryName = countryName;
            this.setCurrentPage(1); // Reset to the first page when the filter changes
        },
        setSelectedShowInstitutes(showinstitutes) {
            this.selectedShowInstitutes = showinstitutes;
            this.setCurrentPage(1); // Reset to the first page when the filter changes
        },
        setSearchInstituteText(searchInstituteText) {
            this.searchInstituteText = searchInstituteText;
            this.setCurrentPage(1); // Reset to the first page when the filter changes
        },
        setFranchiseFilter(franchise) {
            this.franchiseFilter = franchise;
            this.setCurrentPage(1); // Reset to the first page when the filter changes
        },
        setPerPage(perPage) {
            this.perPage = perPage;
            this.setCurrentPage(1); // Reset to the first page when perPage changes
        },

        addInstitute(instituteData) {
            // Check if the institute already exists in the state
            const existingIndex = this.institutes.findIndex(
                (institute) => institute.id === instituteData.id
            );
            if (existingIndex === -1) {
                // Add the institute to the state only if it doesn't exist
                this.institutes.push(instituteData);
            }
        },

        updateInstitute(updatedInstitute) {
            const index = this.institutes.findIndex(
                (institute) => institute.id === updatedInstitute.id
            );
            if (index !== -1) {
                this.institutes[index] = {
                    ...this.institutes[index],
                    ...updatedInstitute,
                };
            }
        },

        checkInstituteExists(instituteData) {
            // Filter institutes by the given country ID
            const institutesInSameCountry = this.institutes.filter(
                (institute) =>
                    institute.country_id === instituteData.newCountryId
            );

            // Check if an institute with the same name and franchise status already exists
            const instituteExists = institutesInSameCountry.some(
                (institute) =>
                    institute.institute === instituteData.newInstitute &&
                    institute.franchise === instituteData.franchise
            );

            return instituteExists;
        },

        updateCountryNameInInstitutes(oldCountryName, newCountryName) {
            this.institutes = this.institutes.map((institute) => {
                if (institute.country === oldCountryName) {
                    return { ...institute, country: newCountryName };
                }
                return institute;
            });
        },

        getTitlesByCountryId(countryId) {
            // Filter the titles array to only include titles with the matching country_id
            return this.titles
                .filter((title) => title.country_id === countryId)
                .map((title) => ({
                    title: title.title,
                    titleType: title.title_type,
                }));
        },

        async deleteInstitute(instituteId) {
            try {
                await axios.delete(`/api/institutes/${instituteId}`);
                this.institutes = this.institutes.filter(
                    (institute) => institute.id !== instituteId
                );
                this.updatePagination();
            } catch (error) {
                console.error("Failed to delete institute:", error);
            }
        },

        updatePagination() {
            if (this.currentPage > this.totalPages) {
                this.currentPage = Math.max(1, this.totalPages);
            }
        },

        deleteInstitutesByCountryId(countryId) {
            console.log("deleteInstitutesByCountryId", countryId);

            // Filter out the institutes that belong to the given countryId
            this.institutes = this.institutes.filter(
                (institute) => institute.country_id !== countryId
            );

            // After deleting the institutes, update the pagination
            this.updatePagination();
        },
    },
});
