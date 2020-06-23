import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret'; // for now

const getUserId = (req) => {
  const header = req.headers.authorization;

  if (!header) throw new Error('Authentication required');

  const token = header.replace(/Bearer\s+/i, '');
  const decoded = jwt.verify(token, JWT_SECRET);

  return decoded.userId;
};

export default getUserId;
