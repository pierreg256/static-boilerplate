import React, { useEffect, useState } from "react";
import { useAuthentication } from "./components/util/authentication";
import "./App.css";
import { ActionButton, Stack } from "@fluentui/react";
import PostsList from "./components/PostsList";

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
    return <PostsList></PostsList>;
  }
  return (
    <div className="wrapper">
      <Stack horizontalAlign="center">
        <h1>You must be logged in to access this app</h1>
        <Stack style={{ width: 300 }} gap={25}>
          <ActionButton>Login</ActionButton>
        </Stack>
      </Stack>
    </div>
  );
}

export default App;
