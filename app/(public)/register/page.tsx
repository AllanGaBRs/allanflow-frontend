import { RegisterForm } from "./components/RegisterForm";
import { getGoogleOAuthUrl } from "../utils/getGoogleOAuthUrl";

export default function RegisterPage() {
  const googleOAuthUrl = getGoogleOAuthUrl(process.env.API_URL);

  return <RegisterForm googleOAuthUrl={googleOAuthUrl} />;
}
