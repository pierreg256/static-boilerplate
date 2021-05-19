import React from "react";
import { Stack, Label, ActivityItem, Link } from "@fluentui/react";
import { TestImages } from "@fluentui/example-data";
import { useQuery, gql } from "@apollo/client";
import * as dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const POSTS = gql`
  query GetPosts {
    posts(where: {}) {
      id
      text
      created
      modified
      author {
        id
        nick_name
      }
    }
  }
`;

function PostsList() {
  const { loading, error, data } = useQuery(POSTS);
  if (loading) return <Label>Loading...</Label>;
  if (error)
    return (
      <Stack childrenGap={10}>
        <Label>Post List Error:</Label>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </Stack>
    );
  return (
    <Stack childrenGap={10}>
      <Label>Posts</Label>
      {data.posts &&
        data.posts.length > 0 &&
        data.posts.map((post, index) => (
          <ActivityItem
            key={index}
            activityDescription={[
              <Link key={1}>
                {post.author ? post.author.nick_name : "Anonymous"}
              </Link>,
              <span key={2}> posted this: </span>,
            ]}
            comments={post.text}
            activityPersonas={
              post.author
                ? [
                    {
                      imageInitials: post.author.nick_name
                        .substring(0, 2)
                        .toUpperCase(),
                      text: post.author.nick_name,
                    },
                  ]
                : [{ imageUrl: TestImages.personaMale, text: "Anonymous" }]
            }
            timeStamp={dayjs(post.created).fromNow()}
          />
        ))}
    </Stack>
  );
}

export default PostsList;
