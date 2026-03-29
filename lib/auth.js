import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const verifyAuth = async (req) => {
  let token;


  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  else {
    const cookieStore = cookies();
    token = cookieStore.get('token')?.value;
  }

  if (!token) {
    return { error: 'Not authorized to access this route', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch (err) {
    return { error: 'Not authorized, invalid or expired token', status: 401 };
  }
};

export const requireAdmin = (user) => {
  if (user.role !== 'admin') {
    return { error: 'Not authorized, admin access required', status: 403 };
  }
  return null;
};
