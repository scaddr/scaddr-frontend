<template>
    <div class="grid grid-cols-3 gap-4 text-white text-center bg-opacity-95 rounded-lg w-fit hover:bg-opacity-100 transition shadow-black">
        <LobbyMenu class="col-span-1 px-16 py-32 bg-black rounded-lg shadow-xl"/>
        <div class="col-span-2 px-16 py-32 bg-black rounded-lg shadow-xl">
            <p>The game has finished</p>
        </div>
    </div>
</template>

<script>
import LobbyMenu from "@/components/Menus/LobbyMenu.vue"

export default {
    name: "LobbyMainView",
    setup() {
    },
    components: {
        LobbyMenu 
    }, 
}
</script>
