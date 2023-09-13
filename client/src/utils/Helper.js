export const getEndpoint = (productionRoute, developmentRoute) => {
    return import.meta.env.VITE_ENV === 'production' ? import.meta.env[productionRoute] : developmentRoute
} 