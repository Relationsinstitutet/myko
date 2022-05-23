export default function parseBearerToken(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring('Bearer '.length);
    return token;
  }

  return null;
}
