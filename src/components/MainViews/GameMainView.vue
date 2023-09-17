<template>
    <div class="grid grid-cols-3 gap-4 text-white text-center bg-opacity-95 rounded-lg w-fit hover:bg-opacity-100 transition shadow-black">
        <GameMenu class="col-span-1 px-16 py-32 bg-black rounded-lg shadow-xl"/>
        <div class="col-span-2 px-16 py-32 bg-blue-700 text-light rounded-lg shadow-xl">
            <h1>Game started</h1>
            <p>Is interrogated {{isInterrogated}}</p>
        </div>
    </div>
</template>

<script>
import { isInterrogated } from '@/components/getters/GameGetters.js'
import GameMenu from '@/components/Menus/GameMenu.vue';

export default {
    name: "GameMainView",
    setup() {
        return {
            isInterrogated
        }
    },
    components: {
        GameMenu
    }
}
</script>
