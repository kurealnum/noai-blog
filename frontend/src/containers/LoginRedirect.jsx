// this is very hacky. doing this so isAuthenticated gets called again and navbar updates. see issue #52 for more information (specifically in commit history)
import { Navigate } from "react-router-dom";

function LoginRedirect() {
  return <Navigate to="/dashboard" />;
}

export default LoginRedirect;
