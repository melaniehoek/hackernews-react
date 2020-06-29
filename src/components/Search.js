import React, { useState } from "react";
import { useLazyQuery } from "react-apollo";
import gql from "graphql-tag";

import Link from "./Link";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const Search = () => {
  const [filter, setFilter] = useState("");
  const [
    loadSearchResults,
    { called, loading, data },
  ] = useLazyQuery(FEED_SEARCH_QUERY, { variables: { filter } });

  return (
    <div>
      <div className="flex">
        <input
          type="text"
          onChange={(e) => setFilter(e.target.value)}
          className="mr1"
        />
        <button className="pointer button" onClick={loadSearchResults}>
          Search
        </button>
      </div>
      {called && !loading
        ? data.feed.links.map((link, index) => (
            <Link key={link.id} link={link} index={index} />
          ))
        : undefined}
    </div>
  );
};

export default Search;
