import { reactive } from "vue" 
import { io } from "socket.io-client"

const scaddrEnvironment = process.env.SCADDR_ENV
const backendUrl = (scaddrEnvironment ?? "DEV") == "DEV" ? "http://localhost:3001" : undefined

export const socketState = reactive({
    connected: false,
    generalEvents: [],
    lobbyEvents: [],
    gameEvents: [],
    userEvents: [],
})
export const socket = io(backendUrl)

socket.on("connect", () => {
    socketState.connected = true;
})

socket.on("disconnect", () => {
    socketState.connected = false;
})

socket.on("lobby/messageEvent", (data) => {
    socketState.lobbyEvents.push(data)
})

socket.on("userEvent", (data) => {
    socketState.userEvents.push(data)
})

socket.on("roomStateEvent", (data) => {
    socketState.generalEvents.push(data)
})

