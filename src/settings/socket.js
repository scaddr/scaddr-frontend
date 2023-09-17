import { reactive } from "vue" 
import { io } from "socket.io-client"

const scaddrEnvironment = process.env.SCADDR_ENV
const backendUrl = (scaddrEnvironment ?? "DEV") == "DEV" ? "http://localhost:3001" : undefined

export const socketState = reactive({
    connected: false,
    roomStatus: "",
    gameEvents: [],
    joinedUsers: [],
    question: {},
    leader: ""
})
export const socket = io(backendUrl)

socket.on("connect", () => {
    socketState.connected = true;
})

socket.on("disconnect", () => {
    socketState.connected = false;
})

socket.on("joinedUsers", (data) => {
    if (data["status"] !== "ok") {
        alert("Failed fetching users")
        return
    }

    socketState.leader = data["leader"]
    socketState.joinedUsers = data["users"]
})

socket.on("gameStatus", (data) => {
    if (data["status"] !== "ok") {
        alert("Failed fetching game status")
        return
    }

    socketState.roomStatus = data["roomStatus"]
})

socket.on("pokeQuestion", (data) => {
    if (data["status"] !== "ok") {
        alert("Failed fetching question")
        return
    }

    socketState.question = data
})
