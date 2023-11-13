<script setup>
</script>

<template>
    <div class="w-screen bg-center bg-no-repeat h-screen flex items-center justify-center">
        <div class="text-white text-center bg-black bg-opacity-95 rounded-lg w-fit px-32 py-10 hover:bg-opacity-100 transition shadow-black shadow-xl box-border">
            <h1 class="text-white text-4xl m-auto mb-10">scaddr</h1>
            <div class="relative h-10 w-full min-w-[200px]">
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

            <div class="relative my-5 h-10 w-full min-w-[200px]">
                <input
                    class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 text-sm text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=" "
                    v-model="maxRounds"
                    type="number"
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
                    Number of rounds:
                </label>
            </div>

            <hr>

            <div class="my-5">
                <label for="csv"> 
                    <p :class="`w-full cursor-pointer border ${ cardsFile ? 'text-blue-500 border-blue-500' : 'text-white border-white' } px-3 py-2.5 rounded-[7px] text-sm opacity-75 hover:opacity-100 transition`">{{ cardsFile ? cardsFile.fileName : "add flashcards file"}}</p>
                </label>
                <input
                    class="hidden"
                    type="file"
                    id="csv" 
                    @change="onCardsPicked"
                />
            </div>

            <button @click="createRoom" class="w-full cursor-pointer border border-white px-3 py-2.5 rounded-[7px] text-black bg-white text-sm opacity-75 hover:opacity-100 transition">Create room</button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
// import { config } from "@/settings/config.js"
import { socket } from '@/settings/socket' 

const cardsFile = ref(null)
const username = ref("")
const maxRounds = ref()

const onCardsPicked = (event) => {
    const files = event.target.files
    if (!files.length) {
        return;
    }

    const fileName = files[0].name
    const fileReader = new FileReader()
    fileReader.addEventListener('load', (event) => {
        cardsFile.value = {
            "contents": event.target.result,
            "fileName": fileName
        };
    })
    fileReader.readAsText(files[0]);
}

export default {
    setup() {
        const wallpaperDefaultClasses = ref("w-screen h-screen bg-center bg-no-repeat")
        const verticallyCenterClasses = ref("h-screen flex items-center justify-center")

        return {
            wallpaperDefaultClasses,
            verticallyCenterClasses,

            cardsFile,
            username,
            maxRounds
        }
    },
    methods: {
        onCardsPicked,
        async createRoom () {
            if (username.value == "") {
                alert("Please enter a valid username value")
                return
            }

            if (maxRounds.value < 0) {
                maxRounds.value = 0
            }

            if (maxRounds.value > 1000) {
                maxRounds.value = 1000;
            }

            if (cardsFile.value == null) {
                alert("Please select a flashcards file")
                return
            }

            const requestBody = {
                username: username.value,
                cardsFile: cardsFile.value,
                maxRounds: maxRounds.value
            } 

            try {
                socket.connect()
                socket.emit("createRoom", requestBody, (response) => {
                    if (response["status"] !== "ok") {
                        alert("Failed creating the room")
                        return
                    }

                    const roomId = response["roomId"] ?? ""
                    if (roomId.trim() === "") {
                        throw new Error("Room ID not received from the server")
                    }

                    sessionStorage.setItem("user", JSON.stringify(response))
                    this.$router.push(`/room/${roomId}`)
                })
            } catch (error) {
                alert("Server connection error. Please contact the server admin.")
            }
        }
    },
    name: "HomepageComponent"
}
</script>
