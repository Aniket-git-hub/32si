import jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from './Helper';

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
  const accessToken = jwt.sign(userData, getEnvironmentVariable('JWT_ACCESS_TOKEN_SECRET'), { expiresIn: '15m' });
  const refreshToken = jwt.sign(userData, getEnvironmentVariable('JWT_REFRESH_TOKEN_SECRET'), { expiresIn: '24h' });
  return { accessToken, refreshToken };
}

export default generateToken;
