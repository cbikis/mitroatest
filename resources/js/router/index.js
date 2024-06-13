import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../Composables/useAuth";

const routes = [
    {
        path: "/",
        component: () => import("../Components/Menus.vue"),
        children: [
            {
                path: "",
                name: "index",
                component: () => import("../Pages/Index.vue"),
                meta: { requiresAuth: false },
            },
            {
                path: "index-1",
                name: "index-1",
                component: () => import("../Pages/Index-1.vue"),
                meta: { requiresAuth: false },
            },
            {
                path: "login",
                name: "login",
                component: () => import("../Pages/Auth/Login.vue"),
                meta: { requiresGuest: true },
            },
            {
                path: "add-country",
                name: "add-country",
                component: () => import("../Pages/Auth/AddCountry.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "add-institute",
                name: "add-institute",
                component: () => import("../Pages/Auth/AddInstitute.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "add-title",
                name: "add-title",
                component: () => import("../Pages/Auth/AddTitle.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "edit-country",
                name: "edit-country",
                component: () => import("../Pages/Auth/EditCountry.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "view-institute/:id",
                name: "view-institute",
                component: () => import("../Pages/ViewInstitute.vue"),
                meta: { requiresAuth: false },
                props: true, // Enable passing route params as props to the component
            },
            {
                path: "edit-institute/:id",
                name: "edit-institute",
                component: () => import("../Pages/Auth/EditInstitute.vue"),
                meta: { requiresAuth: true },
                props: true, // Enable passing route params as props to the component
            },
            {
                path: "edit-title/:id",
                name: "edit-title",
                component: () => import("../Pages/Auth/EditTitle.vue"),
                meta: { requiresAuth: true },
                props: true, // Enable passing route params as props to the component
            },
            {
                path: "delete-country",
                name: "delete-country",
                component: () => import("../Pages/Auth/DeleteCountry.vue"),
                meta: { requiresAuth: true },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const { checkAuthentication, isAuthenticated } = useAuth(); // Destructure checkAuthentication and isAuthenticated

    await checkAuthentication(); // Call checkAuthentication to update isAuthenticated

    if (to.meta.requiresAuth && !isAuthenticated.value) {
        // If the route requires authentication and the user is not authenticated
        next({ name: "login" }); // Redirect to the login route
    } else if (to.meta.requiresGuest && isAuthenticated.value) {
        // If the user is authenticated and trying to access a route that requires the user to be a guest
        next({ name: "index" }); // Redirect to the index route
    } else {
        next(); // Proceed to the route
    }
});

export default router;
