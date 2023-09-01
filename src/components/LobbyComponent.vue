<template>
    <h1>Lobby</h1>
    <p>Room id {{ roomId }}</p>
</template>

<script>
import { ref } from "vue"
import { useRoute } from "vue-router"

const roomId = ref("")

export default {
    name: "LobbyComponent",
    setup() {
        const route = useRoute()

        roomId.value = route.params.roomId

        return {
            roomId
        }
    }

}
</script>
