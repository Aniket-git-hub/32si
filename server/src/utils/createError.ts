class CustomError extends Error {
  originalError: Error | null;
  errors: string[];

  constructor(errorName: string, errorMessage: string, originalError: Error | null = null) {
    super(errorMessage);
    this.name = errorName;
    this.originalError = originalError;
    this.errors = [];
  }
}

export default CustomError;
