import { defineStore } from "pinia";
import axios from "axios";

export const useTitlesStore = defineStore("foreignRecognizedAcademicTitles", {
    state: () => ({
        titles: [],
        isLoading: false,
        isLoaded: false,
        currentPage: 1,
        perPage: 10,
        sortColumn: null,
        sortDirection: "asc",
        searchId: "",
        selectedCountryName: null,
        selectedShowInstitutes: null,
        searchTitleText: "",
        searchTitleTypeText: "",
    }),
    getters: {
        filteredTitles: (state) => {
            return state.titles.filter((title) => {
                const matchesId = state.searchId
                    ? title.id.toString().startsWith(state.searchId)
                    : true;
                const matchesCountry = state.selectedCountryName && state.selectedCountryName !== "-1" // -1 means display everything as a choice
                    ? title.country.toLowerCase() ===
                      state.selectedCountryName.toLowerCase()
                    : true;
                const matchesTitleText = state.searchTitleText
                    ? title.title
                          .toLowerCase()
                          .includes(state.searchTitleText.toLowerCase())
                    : true;
                const matchesTitleTypeText = state.searchTitleTypeText
                    ? title.title_type
                          .toLowerCase()
                          .includes(state.searchTitleTypeText.toLowerCase())
                    : true;
                return (
                    matchesId &&
                    matchesCountry &&
                    matchesTitleText &&
                    matchesTitleTypeText
                );
            });
        },
        paginatedTitles() {
            // Use filteredTitles for pagination
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredTitles.slice(start, end);
        },
        totalPages() {
            // Calculate total pages based on filteredTitles
            return Math.ceil(this.filteredTitles.length / this.perPage);
        },
    },
    actions: {
        // Broadcast a message to other tabs
        broadcastUpdate(newTitle) {
            const channel = new BroadcastChannel("title_updates");
            channel.postMessage({
                type: "UPDATE_TITLE",
                payload: newTitle,
            });
            channel.close();
        },

        broadcastEdit(updatedTitle) {
            const channel = new BroadcastChannel("title_edit");
            channel.postMessage({
                type: "EDIT_TITLE",
                payload: updatedTitle,
            });
            channel.close();
        },

        async editTitle(titleForm, updatedFields) {
            const response = await axios.put(
                `/api/edit-foreign-title/${titleForm.title_id}`,
                updatedFields
            );
            return response;
        },

        async fetchTitles(forceRefresh = false) {
            if (this.titles.length === 0 || forceRefresh) {
                this.isLoading = true;
                try {
                    const response = await axios.get("/api/titles");
                    this.titles = response.data;
                    this.isLoaded = true;
                } catch (error) {
                    console.error("Error fetching academic titles:", error);
                } finally {
                    this.isLoading = false;
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

            this.titles.sort((a, b) => {
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
        setSearchTitleText(searchTitleText) {
            this.searchTitleText = searchTitleText;
            this.setCurrentPage(1); // Reset to the first page when the filter changes
        },
        setSearchTitleTypeText(searchTitleTypeText) {
            this.searchTitleTypeText = searchTitleTypeText;
            this.setCurrentPage(1); // Reset to the first page when the filter changes
        },
        setPerPage(perPage) {
            this.perPage = perPage;
            this.setCurrentPage(1); // Reset to the first page when perPage changes
        },

        // Add a single new title to the list and broadcast the update
        addTitle(newTitle) {
            const existingIndex = this.titles.findIndex(
                (title) => title.id === newTitle.id
            );
            if (existingIndex === -1) {
                this.titles.push(newTitle);
            }
        },

        updateTitle(updatedTitle) {
            const index = this.titles.findIndex(
                (title) => title.id === updatedTitle.id
            );
            if (index !== -1) {
                this.titles[index] = {
                    ...this.titles[index],
                    ...updatedTitle,
                };
            }
        },

        updateCountryNameInTitles(oldCountryName, newCountryName) {
            this.titles = this.titles.map((title) => {
                if (title.country === oldCountryName) {
                    return { ...title, country: newCountryName };
                }
                return title;
            });
        },

        async deleteTitle(titleId) {
            try {
                await axios.delete(`/api/titles/${titleId}`);
                this.titles = this.titles.filter(
                    (title) => title.id !== titleId
                );
                this.updatePagination();
            } catch (error) {
                console.error("Failed to delete title:", error);
            }
        },
        updatePagination() {
            if (this.currentPage > this.totalPages) {
                this.currentPage = Math.max(1, this.totalPages);
            }
        },

        deleteTitlesByCountryId(countryId) {
            console.log("deleteTitlesByCountryId", countryId);

            // Filter out the titles that belong to the given countryId
            this.titles = this.titles.filter(
                (title) => title.country_id !== countryId
            );

            // After deleting the titles, update the pagination
            this.updatePagination();
        },
    },
});
