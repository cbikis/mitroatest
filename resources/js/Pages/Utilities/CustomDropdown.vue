<template>
    <div
        class="text-black relative"
        :class="widthClass"
        ref="dropdownElement"
        @keydown="handleKeydown"
        tabindex="0"
    >
        <div @click="toggleDropdown" class="cursor-pointer">
            <div
                class="block appearance-none w-full bg-white border border-gray-300 py-2 px-3 pr-8 rounded leading-tight focus:outline-none custom-blue-style"
                :class="[
                    widthClass, {
                        'rounded-t-md': dropdownActive, 
                        'rounded-md': !dropdownActive 
                    }
                ]">
                {{ selectedOptionText }}
            </div>
        </div>
        <div
            v-if="dropdownActive"
            class="absolute z-10 left-1/2 transform -translate-x-1/2 w-auto min-w-full bg-white border border-sky-600 rounded-md shadow-lg max-h-60 overflow-y-auto overflow-x-hidden mt-1"
        >
            <div
                v-for="(option, index) in filteredOptions"
                :key="option[optionValue]"
                @click="selectOption(option)"
                :class="{
                    'py-2 px-3 hover:bg-zinc-300 cursor-pointer whitespace-nowrap': true,
                    'bg-gray-400': index === highlightedIndex,
                }"
                class="dropdown-option custom-blue-style"
            >
                {{ option[optionText] }}
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    computed,
    defineProps,
    defineEmits,
    onMounted,
    onBeforeUnmount,
    nextTick,
    watch,
} from "vue";
import { useCountriesStore } from "../../../js/stores/countriesStore";

const countriesStore = useCountriesStore();

let broadcastChannel;
const props = defineProps({
    options: Array,
    widthClass: {
        type: String,
        default: 'w-full' // Default value for width
    },
    optionValue: String,
    optionText: String,
    modelValue: [String, Number],
    placeholder: String,
    required: Boolean,
    readOnly: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(["update:modelValue"]);

const dropdownActive = ref(false);
const dropdownElement = ref(null);
const searchQuery = ref("");
const highlightedIndex = ref(-1);

const selectedOptionText = computed(() => {
    const selectedOption = props.options.find(
        (option) => option[props.optionValue] === props.modelValue
    );
    return selectedOption
        ? selectedOption[props.optionText]
        : props.placeholder;
});

const filteredOptions = computed(() => {
    return props.options.filter((option) =>
        option[props.optionText]
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
    );
});

const toggleDropdown = (e) => {
    console.log("toggle dropdown");
    console.log(props);
    if (props.readOnly) {
        console.log("read only trueeeeeeeeeeeeeee");
        e.preventDefault();
        return;
    }
    dropdownActive.value = !dropdownActive.value;
    if (dropdownActive.value) {
        nextTick(() => {
            dropdownElement.value.focus();
        });
    } else {
        // Clear the search query when the dropdown is closed
        searchQuery.value = "";
        highlightedIndex.value = -1; // Reset the highlighted index
    }
};

const selectOption = (option) => {
    emits("update:modelValue", option[props.optionValue]);
    dropdownActive.value = false;
    // Clear the search query when an option is selected
    searchQuery.value = "";
    highlightedIndex.value = -1; // Reset the highlighted index
};

const handleClickOutside = (event) => {
    if (
        dropdownElement.value &&
        !dropdownElement.value.contains(event.target)
    ) {
        dropdownActive.value = false;
        // Clear the search query when clicking outside
        searchQuery.value = "";
        highlightedIndex.value = -1; // Reset the highlighted index
    }
};

onMounted(() => {
    window.addEventListener("click", handleClickOutside);

    broadcastChannel = new BroadcastChannel("new_country");

    broadcastChannel.onmessage = (message) => {
        if (message.data.type === "ADD_COUNTRY") {
            const newCountry = message.data.payload;
            countriesStore.addCountry(newCountry);
        }
    };
});

onBeforeUnmount(() => {
    window.removeEventListener("click", handleClickOutside);
    broadcastChannel.close();
});

const handleKeydown = (event) => {
    if (event.key === "Escape") {
        dropdownActive.value = false;
        // Clear the search query when Escape is pressed
        searchQuery.value = "";
        highlightedIndex.value = -1; // Reset the highlighted index
        return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const optionsCount = filteredOptions.value.length;
        const direction = event.key === "ArrowDown" ? 1 : -1;
        highlightedIndex.value =
            (highlightedIndex.value + direction + optionsCount) % optionsCount;
        return;
    }

    if (event.key === "Backspace") {
        event.preventDefault(); // Prevent the default backspace behavior
        if (searchQuery.value.length > 0) {
            // Remove the last character from the search query
            searchQuery.value = searchQuery.value.slice(0, -1);
            highlightedIndex.value = 0; // Highlight the first match
        }
        return;
    }

    if (event.key.length === 1 && /[a-zA-Z0-9-_.+?!*$']/.test(event.key)) {
        searchQuery.value += event.key.toLowerCase();
        highlightedIndex.value = 0; // Highlight the first match
    }

    if (event.key === "Enter" && highlightedIndex.value >= 0) {
        selectOption(filteredOptions.value[highlightedIndex.value]);
    }
};

// Watch for changes in the searchQuery to update the highlighted index
watch(searchQuery, (newValue, oldValue) => {
    if (newValue !== oldValue && newValue !== "") {
        highlightedIndex.value = 0; // Highlight the first match
    }
});

</script>


<style scoped>
.custom-blue-style {
    color: rgb(39,67,66);
}
</style>