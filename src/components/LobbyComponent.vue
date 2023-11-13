<template>
    <div v-if="loggedIn">
        <div class="w-screen bg-center bg-no-repeat h-screen flex items-center justify-center">
            <GameMainView v-if="events.roomStatus['state'] == 'game'" />
            <LobbyMainView v-else-if="events.roomStatus['state'] == 'lobby'" />
            <FinishedMainView v-else-if="events.roomStatus['state'] == 'finished'" />
            <div v-else class="col-span-2 px-16 py-32 bg-black rounded-lg shadow-xl">
                <p>Patiently waiting for room status change</p>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="w-screen bg-center bg-no-repeat h-screen flex items-center justify-center">
            <div class="text-white text-center bg-black bg-opacity-95 rounded-lg w-fit px-32 py-10 hover:bg-opacity-100 transition shadow-black shadow-xl box-border">
                <h1 class="text-white text-4xl m-auto mb-10">Join Room</h1>
                <p data-tooltip-target="tooltip-light" data-tooltip-style="light" type="button" class="transition text-white bg-transparent opacity-75
                    hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                    cursor-pointer border border-white mb-2">View Room ID</p>
                <div id="tooltip-light" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                    {{getRoomId}}
                    <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
                <div class="relative h-10 w-full min-w-[200px] mb-2">
                    <input
                        class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 text-sm text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                        placeholder=" "
                        v-model="username"
                    />
                    <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] 
                        font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border 
                        before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all 
                        after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md 
                        after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] 
                        peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] 
                        peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-blue-500
                        peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent 
                        peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        your username:
                    </label>
                </div>

                <button @click="joinPrivateRoom" class="w-full cursor-pointer border border-white px-3 py-2.5 rounded-[7px] text-black bg-white text-sm opacity-75 hover:opacity-100 transition">Join Room</button>
            </div>
        </div>
    </div>

</template>

<script>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import { socketState, socket } from "@/settings/socket"
import { sessionStorageVerify } from "@/components/functions/storage"
import { initFlowbite } from "flowbite"

import LobbyMainView from "@/components/MainViews/LobbyMainView.vue"
import GameMainView from "@/components/MainViews/GameMainView.vue"
import FinishedMainView from "@/components/MainViews/FinishedMainView.vue"

const loggedIn = ref(false)
const username = ref("")

const getRoomId = computed({
    get() {
        const userCredentials = sessionStorageVerify("user")

        if (!userCredentials) {
            return 
        }

        return userCredentials?.roomId
    }
})

export default {
    name: "LobbyComponent",
    setup() {

        return {
            getRoomId,
            loggedIn,
            username,
            events: socketState
        }
    },
    components: {
        LobbyMainView,
        GameMainView,
        FinishedMainView
    },
    methods: {
        checkCredentials () {
            const userCredentials = sessionStorageVerify("user")

            if (!userCredentials) {
                return
            }

            const roomId = userCredentials?.roomId ?? ""
            const username = userCredentials?.username ?? ""
            const usernameHash = userCredentials?.usernameHash ?? ""

            if (username === "" || usernameHash === "") {
                return
            }

            const requestBody = {
                roomId,
                username,
                usernameHash
            }

            socket.emit("userVerify", (requestBody), (response) => {
                if (response["status"] !== "ok") {
                    sessionStorage.removeItem("user")
                    this.$router.go()
                    return
                }

                loggedIn.value = true
            })
        },
        joinPrivateRoom () {
            const userCredentials = sessionStorageVerify("user")

            if (username.value == "") {
                alert("Please enter a valid username value")
                return
            }

            const requestBody = {
                username: username.value, 
                roomId: userCredentials?.roomId ?? ""
            }

            try {
                socket.emit("joinRoom", requestBody, (response) => {
                    if (response["status"] !== "ok") {
                        alert("Failed joining the room")
                        return
                    }

                    const receivedRoomId = response["roomId"] ?? ""
                    if (receivedRoomId.trim() === "") {
                        throw new Error("Room ID not received from the server")
                    }
                    
                    sessionStorage.setItem("user", JSON.stringify(response))
                    loggedIn.value = true;
                }) 
            } catch (error) {
                alert("Server connection error. Please contact the server admin.")
            } 
        },
        startGame () {
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
                        alert("Failed starting room")
                        return
                    }
                })
            } catch (e) {
                alert("Server connection error. Please contact the server admin") 
            }
        }
    },
    beforeMount() {
        if (!socketState.connected) {
            socket.connect()
        }

        const route = useRoute()
        let userCredentials = JSON.parse(sessionStorage.getItem("user") ?? "{}")
        userCredentials.roomId = route.params.roomId

        sessionStorage.setItem("user", JSON.stringify(userCredentials))

        this.checkCredentials()
    },
    onMounted() {
        initFlowbite()
    }


}
</script>
