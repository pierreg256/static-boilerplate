import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(
    `${process.env.REACT_APP_API_URL || ""}/api/user`
  );

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((resp) => {
        setLoading(false);
        return resp.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        setLoading(false);
        console.log("error calling:", url);
        console.log(err);
      });
  }, [url]);

  if (loading) return <p>Loading...</p>;

  if (data)
    return (
      <div>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </div>
    );

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
