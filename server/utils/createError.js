function createError(errorName, errorMessage, originalError) {
    let err = new Error(errorMessage)
    err.name = errorName
    err.originalError = originalError
    return err
}

export default createError