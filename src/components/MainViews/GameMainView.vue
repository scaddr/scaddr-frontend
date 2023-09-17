<template>
    <div class="grid grid-cols-4 gap-10 text-white text-center bg-opacity-95 rounded-lg w-fit hover:bg-opacity-100 transition shadow-black">
        <GameMenu class="col-span-1 px-16 py-32 bg-black rounded-lg shadow-xl"/>
        <div :class="['relative h-full col-span-3 rounded-lg shadow-xl', isInterrogated ? 'bg-blue-700 text-light' : 'bg-black text-white']">
            <!-- top bar -->
            <div class="z-50 absolute w-full border-b-white border border-t-0 border-l-0 border-r-0 rounded-t-lg text-left p-2">
                <h1>Interrogating: {{events.question?.user ?? "Nobody"}}</h1>
            </div>
            <div class="h-full flex items-center justify-center">
                <div class="">
                    <p :class="['text-5xl m-auto w-fit p-5 rounded-lg', isInterrogated ? 'bg-white text-black' : 'bg-blue-600 text-white']">{{events.question?.question}}</p>
                    <div class="grid grid-cols-3 gap-3 mt-10">
                        <div v-for="choice in events.question?.possibleAnswers" :key="choice" class="col-span-1">
                            <p :class="['m-auto bg-none border border-white p-2 rounded-lg text-white', isInterrogated ? 'cursor-pointer hover:bg-white hover:text-black transition' : '']">{{choice}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { socketState } from '@/settings/socket';
import { isInterrogated } from '@/components/getters/GameGetters.js'
import GameMenu from '@/components/Menus/GameMenu.vue';

export default {
    name: "GameMainView",
    setup() {
        return {
            events: socketState,
            isInterrogated
        }
    },
    components: {
        GameMenu
    }
}
</script>
