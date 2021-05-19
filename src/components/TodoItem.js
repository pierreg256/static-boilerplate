import React, { useState } from "react";
import {
  Stack,
  Label,
  IconButton,
  Dialog,
  DialogFooter,
  DefaultButton,
  PrimaryButton,
  DialogType,
} from "@fluentui/react";

import { gql, useMutation } from "@apollo/client";

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: ID) {
    removeTodo(where: { id: $id })
  }
`;

function TodoItem(props) {
  const [openDeleteModal, setOpenModal] = useState(true);
  const [removeTodo, { data, loading, error }] = useMutation(REMOVE_TODO);

  const deleteTodo = (id) => {
    removeTodo({ variables: { id } });
    setOpenModal(true);
  };

  return (
    <Stack>
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
        <Label>{props.todo.text}</Label>
        <IconButton
          iconProps={{ iconName: "trash" }}
          className="clearButton"
          onClick={() => {
            setOpenModal(!openDeleteModal);
          }}
        />
      </Stack>
      <Dialog
        hidden={openDeleteModal}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Delete",
          subText:
            "Are you sure you want to delete this item? This cannot be undone.",
        }}
        modalProps={{
          isBlocking: false,
        }}
      >
        <DialogFooter>
          <PrimaryButton
            text="Yes"
            onClick={() => {
              deleteTodo(props.todo.id);
            }}
          />
          <DefaultButton
            text="No"
            onClick={() => {
              setOpenModal(true);
            }}
          />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
}

export default TodoItem;
