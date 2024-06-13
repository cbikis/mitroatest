import { defineStore } from "pinia";
import axios from "axios";
import { useInstitutesStore } from "./institutesStore";
import { useTitlesStore } from "./titlesStore";

const institutesStore = useInstitutesStore();
const titlesStore = useTitlesStore();

export const useCountriesStore = defineStore("countries", {
    state: () => ({
        countries: [],
        isLoading: false,
        error: null,
        isLoaded: false, // Flag to indicate if the countries have been loaded
    }),
    actions: {
        // Broadcast a message to other tabs
        broadcastUpdate(newCountry) {
            const channel = new BroadcastChannel("new_country");
            channel.postMessage({
                type: "UPDATE_COUNTRY",
                payload: newCountry,
            });
            channel.close();
        },

        // Update the broadcastUpdate method to handle the updated country
        broadcastEdit(updatedCountry) {
            const channel = new BroadcastChannel("country_updates");
            channel.postMessage({
                type: "EDIT_COUNTRY",
                payload: updatedCountry,
            });
            channel.close();
        },

        broadcastDelete(countryId) {
            const channel = new BroadcastChannel("country_deletions");
            channel.postMessage({
                type: "DELETE_COUNTRY",
                payload: countryId,
            });
            channel.close();
        },

        async editCountry(countryId, updatedCountryData) {
            try {
                // Make the API call to update the country
                const response = await axios.put(
                    `/api/edit-country/${countryId}`,
                    updatedCountryData
                );

                // If the update is successful, update the local state
                if (response && response.data) {
                    this.updateCountry({
                        id: countryId,
                        country: updatedCountryData.country,
                    });

                    // Optionally, broadcast the update to other tabs
                    this.broadcastUpdate({
                        id: countryId,
                        country: updatedCountryData.country,
                    });

                    return response.data; // Return the updated data
                }
            } catch (error) {
                // Handle any errors
                this.error = error;
                console.error(
                    "There was an error updating the country:",
                    error
                );
                throw error; // Re-throw the error to be handled by the caller
            }
        },

        async deleteCountry(countryId) {
            try {
                // Make the API call to delete the country
                const response = await axios.delete(
                    `/api/delete-country/${countryId}`
                );

                // If the deletion is successful, remove the country from the local state
                if (response && response.data) {
                    this.countries = this.countries.filter(
                        (country) => country.id !== countryId
                    );

                    // Optionally, broadcast the deletion to other tabs
                    institutesStore.deleteInstitutesByCountryId(countryId);
                    titlesStore.deleteTitlesByCountryId(countryId);
                    this.broadcastDelete(countryId);

                    return response.data; // Return the deletion confirmation
                }
            } catch (error) {
                // Handle any errors
                this.error = error;
                console.error(
                    "There was an error deleting the country:",
                    error
                );
                throw error; // Re-throw the error to be handled by the caller
            }
        },

        // Add a single new country to the list
        addCountry(newCountry) {
            const existingIndex = this.countries.findIndex(
                (country) => country.id === newCountry.id
            );
            if (existingIndex === -1) {
                const insertIndex = this.countries.findIndex(
                    (country) =>
                        country.country.localeCompare(newCountry.country) > 0
                );

                if (insertIndex === -1) {
                    this.countries.push(newCountry);
                } else {
                    this.countries.splice(insertIndex, 0, newCountry);
                }
            }
        },

        getCountryNameById(countryId) {
            const country = this.countries.find((c) => c.id === countryId);
            return country ? country.country : null;
        },

        // Update all instances of the country in the list by ID
        updateCountry(updatedCountry) {
            this.countries = this.countries.map((country) => {
                if (country.id === updatedCountry.id) {
                    // Return a new object with the updated name
                    return { ...country, country: updatedCountry.country };
                }
                return country;
            });
        },

        async fetchCountries(forceRefresh = false) {
            // Only fetch countries if they haven't been loaded or if a force refresh is requested
            if (!this.isLoaded || forceRefresh) {
                this.isLoading = true;
                this.error = null;
                try {
                    const response = await axios.get("/api/countries");
                    this.countries = response.data;
                    this.isLoaded = true; // Set the flag to true after successfully fetching data
                } catch (error) {
                    this.error = error;
                    console.error(
                        "There was an error fetching the countries:",
                        error
                    );
                } finally {
                    this.isLoading = false;
                }
            }
        },
    },
});
