<template>
    <div class="grid grid-cols-4 gap-10 text-white text-center bg-opacity-95 rounded-lg w-fit hover:bg-opacity-100 transition shadow-black">
        <GameMenu class="col-span-1 px-16 py-32 bg-black rounded-lg shadow-xl"/>
        <div :class="['relative flex flex-col gap-0 grid-rows-2 h-full col-span-3 rounded-lg shadow-xl', isInterrogated ? 'bg-blue-700 text-light' : 'bg-black text-white']">
            <!-- top bar -->
            <div class="border-b-white border border-t-0 border-l-0 border-r-0 rounded-t-lg text-left p-2">
                <h1>Interrogating: {{events.question?.user ?? "Nobody"}}</h1>
                <h1>Round: {{events.roomStatus["currentRound"]}}</h1>
            </div>
            <div class="mt-10 pb-10">
                <p :class="['select-none text-5xl m-auto mt-10 w-fit p-5 rounded-lg', isInterrogated ? 'bg-white text-black' : 'bg-blue-600 text-white']">{{events.question?.question}}</p>

                <!-- if the user got the question right --> 
                <div class="grid grid-rows-3 gap-3 mt-10" v-if="events.validation?.result == 'correct'">
                    <div v-for="choice in events.question?.possibleAnswers" :key="choice" class="col-span-1">
                        <p class="m-auto w-fit min-w-[200px] select-none bg-none border border-white p-2 rounded-lg text-white" 
                            :class="{'cursor-pointer hover:bg-white hover:text-black transition': isInterrogated, 
                                correctChoice: choice == events.validation?.userChoice,
                                noChoose: choice != events.validation?.correctAnswer && choice != events.validation?.userChoice
                            }"
                        >{{choice}}</p>
                    </div>
                </div>
                <!-- if the user got the question wrong --> 
                <div class="grid grid-rows-3 gap-3 mt-10" v-else-if="events.validation?.result == 'wrong'"> 
                    <div v-for="choice in events.question?.possibleAnswers" :key="choice" class="col-span-1">
                        <p class="m-auto w-fit min-w-[200px] select-none bg-none border border-white p-2 rounded-lg text-white" 
                            :class="{'cursor-pointer hover:bg-white hover:text-black transition': isInterrogated, 
                                correctChoice: choice == events.validation?.correctAnswer, 
                                wrongChoice: choice == events.validation?.userChoice,
                                noChoose: (choice != events.validation?.correctAnswer && choice != events.validation?.userChoice)

                            }"
                        >{{choice}}</p>
                    </div>
                </div>
                <!-- if the user hasn't answered to the question yet --> 
                <div class="grid grid-rows-3 gap-3 mt-10" v-else>
                    <div v-for="choice in events.question?.possibleAnswers" :key="choice" class="col-span-1">
                        <p @click="isInterrogated ? sendAnswer(choice) : undefined" 
                            class="m-auto w-fit min-w-[200px] select-none bg-none border border-white p-2 rounded-lg text-white" 
                            :class="{'cursor-pointer hover:bg-white hover:text-black transition': isInterrogated}"
                        >{{choice}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

.correctChoice {
    animation: correctChoiceAnimation 0.40s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes correctChoiceAnimation {
    100% {
        background: #15803d;
        color: white; 
        border-color: #15803d;
    }
}

.wrongChoice {
    animation: wrongChoiceAnimation 0.40s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes wrongChoiceAnimation {
    100% {
        background: #b91c1c; 
        color: white; 
        border-color: #b91c1c;
    }
}

.noChoose {
    animation: noChooseAnimation 0.40s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    cursor: pointer !important;
    pointer-events: none;
}

@keyframes  noChooseAnimation {
    100% {
        opacity: .7;
    }
}

</style>

<script>
import { socketState, socket } from '@/settings/socket';
import { isInterrogated } from '@/components/getters/GameGetters.js'
import { sessionStorageVerify } from '../functions/storage';
import GameMenu from '@/components/Menus/GameMenu.vue';

import correctSound from '@/assets/sfx/correct-01.mp3'
import wrongSound from '@/assets/sfx/failure-01.wav'

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
    }, 
    methods: {
        sendAnswer(userChoice) {
            const userCredentials = sessionStorageVerify("user")

            if (!userCredentials) {
                return
            }

            const requestBody = {
                roomId: userCredentials?.roomId ?? "",
                username: userCredentials?.username ?? "",
                usernameHash: userCredentials?.usernameHash ?? "",
                userChoice
            }

            socket.emit("pokeAnswer", requestBody)
        }
    },
    watch: {
        "events.validation.result": function(val) {
            if (val == "correct") {
                const audio = new Audio(correctSound);
                audio.play()
                return
            }

            if (val == "wrong") {
                const audio = new Audio(wrongSound)
                audio.play()
                return
            }
        }
    }
}
</script>
