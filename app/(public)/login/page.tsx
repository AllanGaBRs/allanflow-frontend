import { getGoogleOAuthUrl } from "../utils/getGoogleOAuthUrl";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  const googleOAuthUrl = getGoogleOAuthUrl(process.env.API_URL);

  return <LoginForm googleOAuthUrl={googleOAuthUrl} />;
}
