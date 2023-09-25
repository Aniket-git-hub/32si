import jwt from 'jsonwebtoken';

interface UserData {
  id: string;
  name: string;
  email: string;
  username: string;
}

interface Token {
  accessToken: string;
  refreshToken: string;
}

function generateToken(userData: UserData): Token {
  const accessToken = jwt.sign(userData, process.env.JWT_ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });
  const refreshToken = jwt.sign(userData, process.env.JWT_REFRESH_TOKEN_SECRET as string, { expiresIn: '24h' });
  return { accessToken, refreshToken };
}

export default generateToken;
