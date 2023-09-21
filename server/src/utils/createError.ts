class CustomError extends Error {
    originalError: Error | null;

    constructor(errorName: string, errorMessage: string, originalError: Error | null = null) {
        super(errorMessage);
        this.name = errorName;
        this.originalError = originalError;
    }
}

export default CustomError;