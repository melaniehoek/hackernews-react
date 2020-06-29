import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import useAuthToken from "../hooks/useAuthToken";

const Header = () => {
  const { authToken, removeAuthToken } = useAuthToken();
  const history = useHistory();

  return (
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <div className="fw7 mr1">Hacker News</div>
        <Link to="/" className="ml1 no-underline black">
          new
        </Link>
        <div className="ml1">|</div>
        <Link to="/top" className="ml1 no-underline black">
          top
        </Link>
        <div className="ml1">|</div>
        <Link to="/search" className="ml1 no-underline black">
          search
        </Link>
        {authToken && (
          <>
            <div className="ml1">|</div>
            <Link to="/create" className="ml1 no-underline black">
              submit
            </Link>
          </>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              removeAuthToken();
              history.push("/");
            }}
          >
            logout
          </div>
        ) : (
          <Link to="/login" className="ml1 no-underline black">
            login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
