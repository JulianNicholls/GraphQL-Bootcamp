import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret'; // for now

const getUserId = (req, requireAuth = true) => {
  const header = req.request
    ? req.request.headers.authorization
    : req.connection.context.Authorization;

  if (header) {
    const token = header.replace(/Bearer\s+/i, '');
    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded.userId;
  }

  if (requireAuth) throw new Error('Authentication is required');

  return null; // No auth header, but not required
};

export default getUserId;
