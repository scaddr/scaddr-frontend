<template>
    <div class="grid grid-cols-3 gap-4 text-white text-center bg-opacity-95 rounded-lg w-fit hover:bg-opacity-100 transition shadow-black">
        <LobbyMenu class="col-span-1 px-16 py-32 bg-black rounded-lg shadow-xl"/>
        <div class="col-span-2 px-16 py-32 bg-black rounded-lg shadow-xl">
            <div v-if="isLeader">
                <p>Currently, you're the leader of the lobby</p>
                <button @click="startGame" class="w-fit mt-2 cursor-pointer border border-blue-500 px-3 py-2.5 rounded-[7px] text-blue-500 bg-transparent text-sm opacity-75 hover:opacity-100 transition">Start the Game</button>
            </div>
            <div v-else>
                <p>You're a participant of this game.</p>
                <p>Please wait for the room leader to start the game</p>
            </div>
        </div>
    </div>
</template>

<script>
import { isLeader } from '@/components/getters/LobbyGetters'
import { socket } from "@/settings/socket"
import { sessionStorageVerify } from '@/components/functions/storage'

import LobbyMenu from "@/components/Menus/LobbyMenu.vue"

export default {
    name: "LobbyMainView",
    setup() {
        return {
            isLeader
        }
    },
    components: {
        LobbyMenu 
    }, 
    methods: {
        async startGame () {
            const userCredentials = sessionStorageVerify("user")

            if (!userCredentials) {
                return
            }

            const requestBody = {
                roomId: userCredentials?.roomId ?? "",
                username: userCredentials?.username ?? "", 
                usernameHash: userCredentials?.usernameHash ?? ""
            }

            try {
                socket.emit("startGame", requestBody, (response) => {
                    if (response["status"] !== "ok") {
                        console.log(response["reason"])
                        alert("Failed starting room")
                        return
                    }
                })
            } catch (e) {
                alert("Server connection error. Please contact the server admin") 
            }
        }
    }
}
</script>
