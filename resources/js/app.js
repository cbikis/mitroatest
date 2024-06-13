import "./bootstrap";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "./Pages/App.vue";
import router from "./router";

async function loadLocaleMessages() {
    const context = import.meta.glob("./locales/*.json");
    const messages = {};
    for (const path in context) {
        const matched = path.match(/\.\/locales\/(.*)\.json$/);
        if (matched && matched.length > 1) {
            const locale = matched[1];
            messages[locale] = (await context[path]()).default;
        }
    }
    return messages;
}

loadLocaleMessages().then((messages) => {
    const i18n = createI18n({
        legacy: false, // you must specify 'legacy: false' option
        locale: "el", // set default locale
        fallbackLocale: "en", // set fallback locale
        messages,
    });

    const app = createApp(App);

    app.use(router);
    app.use(createPinia());
    app.use(i18n); // Use vue-i18n

    app.mount("#app");
});
