async function logout(req, res, next) {
    try {
        res.clearCookie('refreshToken', { path: '/' })
        res.status(200).json({
            message:"user logged out"
        })
    } catch (error) {
        next(error)
    }
}

export default logout