import React, { useEffect, useState } from "react";
import { useAuthentication } from "./components/util/authentication";
import "./App.css";
import { Stack } from "@fluentui/react";

function App() {
  const { getUser } = useAuthentication();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();
      setUser(user);
      setLoading(false);
    };

    fetchData();
  }, []);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    return <pre>{JSON.stringify(user, null, 2)}</pre>;
  }
  return (
    <div className="wrapper">
      <Stack horizontalAlign="center">
        <h1>Todo App using Fluent UI & React</h1>
        <Stack style={{ width: 300 }} gap={25}>
          Add todo component... TodoList componets...
        </Stack>
      </Stack>
    </div>
  );
}

export default App;
