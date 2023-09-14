export const devPrint = (message, ...rest) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(message, ...rest)
    }
}