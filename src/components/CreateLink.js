import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { useHistory } from "react-router-dom";

import { FEED_QUERY } from "./LinkList";
import { LINKS_PER_PAGE } from "../constants";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState();
  const history = useHistory();

  const [postMutation] = useMutation(POST_MUTATION, {
    variables: { description, url },
    onCompleted: () => {
      setError();
      history.push("/new/1");
    },
    update: (cache, { data: { post } }) => {
      const first = LINKS_PER_PAGE;
      const skip = 0;
      const orderBy = "createdAt_DESC";
      const data = cache.readQuery({
        query: FEED_QUERY,
        variables: { first, skip, orderBy },
      });
      data.feed.links.unshift(post);
      cache.writeQuery({
        query: FEED_QUERY,
        data,
        variables: { first, skip, orderBy },
      });
    },
  });

  const onSubmit = () => {
    postMutation().catch((err) =>
      setError("Something went wrong, you must be logged in to add a new link.")
    );
  };

  return (
    <div className="flex flex-column mt3">
      <input
        className="mb2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        placeholder="A description for the link"
      />
      <input
        className="mb2"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        type="text"
        placeholder="The URL for the link"
      />
      <button onClick={onSubmit}>Submit</button>
      {error && <p className="red">{error}</p>}
    </div>
  );
};

export default CreateLink;
