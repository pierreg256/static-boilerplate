import React, { useEffect, useState } from "react";
import { useAuthentication } from "./components/util/authentication";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const { getUser } = useAuthentication();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetch data");
      const user = await getUser();
      console.log(user);
    };

    fetchData();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
