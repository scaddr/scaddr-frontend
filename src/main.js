import { createApp } from "vue"
import { createRouter, createWebHistory} from "vue-router"
import App from "./App.vue"
import HomepageComponent from "./components/HomepageComponent.vue"
import LobbyComponent from "./components/LobbyComponent.vue"

const routes = [
    { path: "/", component: HomepageComponent},
    { path: "/lobby", component: LobbyComponent},
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

createApp(App).use(router).mount("#app")
