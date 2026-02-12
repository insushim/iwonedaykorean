// =============================================================================
// HaruKorean - Logout API Route
// =============================================================================

export async function POST() {
  const response = Response.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    'token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/',
  );
  return response;
}
