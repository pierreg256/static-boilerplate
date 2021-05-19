import { Label, Stack } from "@fluentui/react";
import { useQuery, gql } from "@apollo/client";

import TodoItem from "./TodoItem";

const TODOS = gql`
  query GetPosts($owner: ID!) {
    todos(where: { owner_id: $owner }) {
      id
      text
      owner_id
    }
  }
`;

function TodoList(props) {
  const { loading, error, data } = useQuery(TODOS, {
    variables: { owner: props.user.userId },
    pollInterval: 500,
  });

  if (loading) return <Label>Loading...</Label>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <Stack childrenGap={10}>
      {data.todos.length > 0 ? (
        data.todos.map((todo) => <TodoItem todo={todo} key={todo.id} />)
      ) : (
        <Label>Todo list is empty...</Label>
      )}
    </Stack>
  );
}

export default TodoList;
