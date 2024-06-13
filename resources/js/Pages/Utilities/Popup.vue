<script setup>
import { watch } from "vue";

const props = defineProps({
    message: String,
    isVisible: Boolean,
});

const emit = defineEmits(["update:isVisible"]);

const closePopup = () => {
    emit("update:isVisible", false);
};

watch(
    () => props.isVisible,
    (newVal) => {
        if (newVal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }
);
</script>

<template>
    <transition name="fade">
        <div
            v-if="isVisible"
            class="fixed inset-0 bg-[#c4dff6] bg-opacity-50 flex justify-center items-center z-[2000]"
            @click.self="closePopup"
        >
            <div
                class="bg-sky-300 text-black p-6 rounded-lg shadow-lg text-center"
            >
                <p>{{ message }}</p>
                <button
                    @click="closePopup"
                    class="mt-4 bg-[#c4dff6] hover:bg-[#77b6ea] py-2 px-4 rounded-lg"
                >
                    OK
                </button>
            </div>
        </div>
    </transition>
</template>

<style></style>
