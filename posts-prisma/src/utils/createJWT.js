import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret'; // for now

const createJWT = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '3d' });
};

export default createJWT;
