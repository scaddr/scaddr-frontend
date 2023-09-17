import { computed } from "vue"
import { socketState } from "@/settings/socket"
import { sessionStorageVerify } from "@/components/functions/storage"

export const isLeader = computed({
    get() {
        // get username 
        const userCredentials = sessionStorageVerify("user")

        if (!userCredentials) {
            alert(1)
            return
        }
        
        const username = userCredentials.username 
        return username === socketState.leader
    }
})
