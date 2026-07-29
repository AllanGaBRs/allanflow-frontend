import { Suspense } from "react";
import { getGoogleOAuthUrl } from "../utils/getGoogleOAuthUrl";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  const googleOAuthUrl = getGoogleOAuthUrl(process.env.API_URL);

  return (
    <Suspense>
      <LoginForm googleOAuthUrl={googleOAuthUrl} />
    </Suspense>
  );
}
