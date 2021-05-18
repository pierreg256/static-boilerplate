import React from "react";
import { Stack, Label } from "@fluentui/react";
import { useQuery, gql } from "@apollo/client";

const POSTS = gql`
  query GetPosts {
    posts(where: {}) {
      id
      text
      author {
        id
        nick_name
      }
      created_by
      created
      modified_by
      modified
    }
  }
`;

function PostsList() {
  const { loading, error, data } = useQuery(POSTS);
  if (loading) return <Label>Loading...</Label>;
  if (error)
    return (
      <Stack childrenGap={10}>
        <Label>Error:</Label>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </Stack>
    );
  return (
    <Stack gap={10}>
      <Label>Result</Label>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Stack>
  );
}

export default PostsList;
