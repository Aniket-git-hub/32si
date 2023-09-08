import jwt from 'jsonwebtoken'

function generateToken(userData) {
    const accessToken = jwt.sign(userData, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1m' })
    const refreshToken = jwt.sign(userData, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '24h' })
    return {accessToken, refreshToken}
}

export default generateToken