// In production a route can be overridden with an env variable; when it isn't set the default path is used
// (relative paths resolve against the axios base URL, so new endpoints work without extra configuration).
export const getEndpoint = (productionRoute, developmentRoute) => {
    return import.meta.env.VITE_ENV === 'production'
        ? import.meta.env[productionRoute] ?? developmentRoute
        : developmentRoute
}

export const devPrint = (message, ...rest) => {
    if (import.meta.env.VITE_ENV === 'development') {
        console.log(message, ...rest)
    }
}