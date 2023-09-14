export const getEndpoint = (productionRoute, developmentRoute) => {
    return import.meta.env.VITE_ENV === 'production' ? import.meta.env[productionRoute] : developmentRoute
} 

export const devPrint = (message, ...rest) => {
    if (import.meta.env.VITE_ENV === 'development') {
        console.log(message, ...rest)
    }
}