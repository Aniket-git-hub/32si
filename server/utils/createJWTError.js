function createJWTError(message) {
    let err = new Error(message);
    err.name = "JsonWebTokenError";
    return err;
}

export default createJWTError