import { reactive } from "vue"

const scaddrEnvironment = process.env.SCADDR_ENV
const backendUrl = (scaddrEnvironment ?? "DEV") == "DEV" ? "http://localhost:3001" : "PRODUCTION_BACKEND_URL"

export const config = reactive({
  scaddrEnvironment,
  backendUrl
})
