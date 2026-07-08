import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

// In a real app, you would use a stronger, hidden secret.
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-polling-booth-key'
);

export type UserPayload = {
  id: string;
  username: string;
  role: string;
};

export async function signToken(payload: UserPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // 1 day expiration
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) return null;

  return await verifyToken(token);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

export async function createSession(payload: UserPayload) {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
}
