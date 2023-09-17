<template>
    <div>
        <h1>Players:</h1>
        <ul class="w-48 text-sm font-medium mt-2 select-none">
            <li v-for="user in events.joinedUsers" :key="user" class="my-1 w-full 
                px-2 py-1 bg-transparent border opacity-75 transition 
                hover:opacity-100 rounded" :class="[user === events.leader ? 'border-blue-500 text-blue-500' : 'border-white text-white']">
                {{user}}
            </li>
        </ul>
    </div>
</template>

<script>
import { socketState } from "@/settings/socket"

export default {
    name: "LobbyMenu",
    setup() {
        return {
            events: socketState
        }
    }
}
</script>
