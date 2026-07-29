export function getGoogleOAuthUrl(apiUrl: string | undefined) {
  if (!apiUrl) {
    throw new Error("API_URL is not configured");
  }

  return new URL("/oauth2/authorization/google", apiUrl).toString();
}
