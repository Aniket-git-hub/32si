/**
 * Function to print messages to the console in development mode.
 * @param {string} message - The main message to print.
 * @param {...any} rest - Additional data to print.
 */
export const devPrint = (message: string, ...rest: any[]): void => {
    if (process.env.NODE_ENV === 'development') {
        console.log(message, ...rest);
    }
};
