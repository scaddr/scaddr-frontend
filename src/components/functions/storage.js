const sessionStorageVerify = (storageKey) => {
    let storage = sessionStorage.getItem(storageKey)

    if (storage === null) {
        return false
    } 

    return JSON.parse(storage)
}

module.exports = {
    sessionStorageVerify
}
