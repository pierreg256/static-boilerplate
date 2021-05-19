import React, { useState } from "react";
import { Stack, TextField, PrimaryButton } from "@fluentui/react";
import { gql, useMutation } from "@apollo/client";

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!, $owner: ID!, $id: ID) {
    createTodo(data: { text: $text, owner_id: $owner, id: $id }) {
      id
      text
      owner_id
    }
  }
`;

function AddTodo(props) {
  const [todoName, setTodoName] = useState("");
  const [createTodo, { data, loading, error }] = useMutation(CREATE_TODO);
  const addTodo = () => {
    //props.addTodo(todoName);
    createTodo({
      variables: {
        text: todoName,
        owner: props.user.userId,
        id: new Date().getTime().toString(36),
      },
    });
    setTodoName("");
  };
  const setTodo = (e) => {
    setTodoName(e.target.value);
  };

  return (
    <Stack>
      <Stack horizontal>
        <Stack.Item grow>
          <TextField
            placeholder="Add new item"
            value={todoName}
            onChange={setTodo}
          />
        </Stack.Item>
        <PrimaryButton onClick={addTodo}>Add</PrimaryButton>
      </Stack>
    </Stack>
  );
}

export default AddTodo;
