import { computed } from "vue"
import { socketState } from "@/settings/socket"
import { sessionStorageVerify } from "@/components/functions/storage"

export const isInterrogated = computed({
    get() {
        if (socketState.question === null) {
            return false
        }

        // get username + hash
        const userCredentials = sessionStorageVerify("user")

        if (!userCredentials) {
            return false
        }

        const username = userCredentials.username

        if (username !== socketState.question.user) {
            return false
        }

        return true
    }
})
