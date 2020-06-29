import React from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";

import { timeDifferenceForDate } from "../utils";
import { AUTH_TOKEN } from "../constants";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const Link = ({ link, index, updateCacheAfterVote }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [voteMutation] = useMutation(VOTE_MUTATION, {
    variables: { linkId: link.id },
    update: (cache, { data: { vote } }) =>
      updateCacheAfterVote(cache, vote, link.id),
  });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}</span>
        {authToken && (
          <div className="ml1 gray f11 cursor" onClick={voteMutation}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description}{" "}
          <a className="gray cursor f11" href={link.url}>
            ({link.url})
          </a>
        </div>
        <div className="f11 lh-copy gray">
          {link.votes.length} votes | by{" "}
          {link.postedBy ? link.postedBy.name : "unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
