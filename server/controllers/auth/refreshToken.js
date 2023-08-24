import generateToken from "../../utils/generateToken.js"

function refreshToken(req, res) {
    const { id, name, email, username } = req.user
    const { accessToken } = generateToken({ id, name, email, username })
    res.json({accessToken})
}

export default refreshToken