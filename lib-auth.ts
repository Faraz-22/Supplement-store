// src/lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

/**
 * Verify JWT token from request headers
 */
export async function verifyAuth(request: NextRequest): Promise<AuthPayload | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    
    return decoded;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

/**
 * Verify if user is admin
 */
export async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const auth = await verifyAuth(request);
  return auth !== null && (auth.role === 'ADMIN' || auth.role === 'SUPER_ADMIN');
}

/**
 * Generate JWT token
 */
export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
}

/**
 * Decode token without verification (for client-side)
 */
export function decodeToken(token: string): AuthPayload | null {
  try {
    return jwt.decode(token) as AuthPayload;
  } catch {
    return null;
  }
}
