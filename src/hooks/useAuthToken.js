import { useCookies } from "react-cookie";

import { AUTH_TOKEN } from "../constants";

const useAuthToken = () => {
  const [cookies, setCookie, removeCookie] = useCookies([AUTH_TOKEN]);

  const setAuthToken = (authToken) => setCookie(AUTH_TOKEN, authToken);
  const removeAuthToken = () => removeCookie(AUTH_TOKEN);

  return { authToken: cookies[AUTH_TOKEN], setAuthToken, removeAuthToken };
};

export default useAuthToken;
