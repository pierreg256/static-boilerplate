import React from "react";
import { useSessionStorage } from "react-use";
import { useCookies } from "react-cookie";

const defaultValues = Object.freeze({
  login: () => {},
  logout: () => {},
  getUser: () => {},
});

const AUTH_STORAGE_KEY = "authentication";

export const AuthenticationContext = React.createContext(defaultValues);

export function AuthenticationProvider({ children }) {
  const [authentication, setAuthentication] = useSessionStorage(
    AUTH_STORAGE_KEY,
    defaultValues
  );
  const [cookies, setCookies] = useCookies();

  const login = (principal) => setAuthentication({ principal });

  const logout = () => setAuthentication(defaultValues);

  const getUser = async () => {
    try {
      console.log("getUser");
      const response = await fetch("/.auth/me");
      const data = await response.json();
      const user = data.clientPrincipal;
      return getGitHubUserInfo(user);
    } catch (error) {
      return null;
    }
  };

  const getGitHubUserInfo = async (user) => {
    if (!user) return null;
    try {
      const response = await fetch(
        `https://api.github.com/users/${user.userDetails}`
      );
      const data = await response.json();
      user.details = data;
      return user;
    } catch (error) {
      return null;
    }
  };

  const values = { ...authentication, login, logout, getUser };

  return (
    <AuthenticationContext.Provider value={values}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication() {
  return React.useContext(AuthenticationContext);
}
