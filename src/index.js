import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthenticationProvider } from "./components/util/authentication";
import { CookiesProvider } from "react-cookie";
import { Fabric } from "@fluentui/react";
import { ApolloProvider } from "@apollo/client/react";

import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_URL}/api/query`,
  cache: new InMemoryCache({}),
});

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <AuthenticationProvider>
        <ApolloProvider client={client}>
          <Fabric>
            <App />
          </Fabric>
        </ApolloProvider>
      </AuthenticationProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
