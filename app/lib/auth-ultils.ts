// app/lib/auth-ultils.ts
import { prisma } from './prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function verifyUser(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true
      }
    });
    return user;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  // Try to get token from cookies (compatible with your current setup)
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    if (cookies.token) {
      return cookies.token;
    }
  }
  
  // Fallback: try to get from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}