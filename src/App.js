import React, { useEffect, useState } from "react";
import { useAuthentication } from "./components/util/authentication";
import "./App.css";
import { Stack, Link, Persona, PersonaSize } from "@fluentui/react";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";

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
    return (
      <div className="wrapper">
        <Stack horizontalAlign="center">
          <Persona
            imageUrl={user.details.avatar_url}
            text={user.details.name}
            secondaryText={user.details.bio}
            tertiaryText={<Link href="/logout">Logout</Link>}
            size={PersonaSize.size100}
          ></Persona>
          <h1>My Todo List!</h1>
          <Stack style={{ width: 300 }} childrenGap={25}>
            <AddTodo user={user}></AddTodo>
            <TodoList user={user}></TodoList>
          </Stack>
        </Stack>
      </div>
    );
  }
  return (
    <div className="wrapper">
      <Stack horizontalAlign="center">
        <h1>
          Please <Link href="/login">log in</Link> to access this app
        </h1>
      </Stack>
    </div>
  );
}

export default App;
