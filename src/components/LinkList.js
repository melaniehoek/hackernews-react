import React, { useEffect, useMemo } from "react";
import Link from "./Link";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { useLocation, useParams, useHistory } from "react-router";

import { LINKS_PER_PAGE } from "../constants";

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
      links {
        id
        createdAt
        url
        description
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

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
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
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
      user {
        id
      }
    }
  }
`;

const LinkList = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const isNewPage = location.pathname.includes("new");
  const pageIndex = params.page ? (params.page - 1) * LINKS_PER_PAGE : 0;
  const page = parseInt(params.page, 10);
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? "createdAt_DESC" : null;

  const { loading, error, data, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: { first, skip, orderBy },
  });

  const linksToRender = useMemo(() => {
    if (!loading && !error) {
      if (isNewPage) {
        return data.feed.links;
      }
      const rankedLinks = data.feed.links.slice();
      rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
      return rankedLinks;
    }
    return [];
  }, [data, loading, error]);

  const updateCacheAfterVote = (cache, createVote, linkId) => {
    const data = cache.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy },
    });

    const votedLink = data.feed.links.find((link) => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    cache.writeQuery({ query: FEED_QUERY, data });
  };

  const nextPage = () => {
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      history.push(`/new/${nextPage}`);
    }
  };
  const previousPage = () => {
    if (page > 1) {
      const previousPage = page - 1;
      history.push(`/new/${previousPage}`);
    }
  };

  const subscribeToNewLink = () => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newLink = subscriptionData.data.newLink;
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);
        if (exists) return prev;

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename,
          },
        });
      },
    });
  };

  const subscribeToNewVotes = () => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION,
    });
  };

  useEffect(() => {
    if (!loading && !error) {
      subscribeToNewLink();
      subscribeToNewVotes();
    }
  }, [data]);

  if (loading) return <div>Fetching</div>;
  if (error) return <div>Error</div>;
  return (
    <div>
      <div>
        {linksToRender.map((link, index) => (
          <Link
            key={link.id}
            link={link}
            index={index + pageIndex}
            updateCacheAfterVote={updateCacheAfterVote}
          />
        ))}
        {isNewPage && (
          <div className="flex ml4 mv3 gray">
            <div className="pointer mr2" onClick={previousPage}>
              Previous
            </div>
            <div className="pointer" onClick={nextPage}>
              Next
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkList;
