import React from "react";
import { useSessionStorage } from "react-use";
import { useCookies } from "react-cookie";

const defaultValues = Object.freeze({
  isAuthenticated: () => {},
  principal: null,
  login: () => {},
  logout: () => {},
});

const AUTH_STORAGE_KEY = "authentication";

export const AuthenticationContext = React.createContext(defaultValues);

export function AuthenticationProvider({ children }) {
  const [authentication, setAuthentication] = useSessionStorage(
    AUTH_STORAGE_KEY,
    defaultValues
  );
  const [authCookie] = useCookies(["StaticWebAppsAuthCookie"]);

  const login = (principal) => setAuthentication({ principal });

  const logout = () => setAuthentication(defaultValues);

  const isAuthenticated = () => {
    return authCookie.StaticWebAppsAuthCookie ? true : false;
  };
  const values = { ...authentication, isAuthenticated, login, logout };

  console.log(authCookie);

  return (
    <AuthenticationContext.Provider value={values}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication() {
  return React.useContext(AuthenticationContext);
}
