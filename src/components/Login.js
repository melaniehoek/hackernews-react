import React, { useState } from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";

import useAuthToken from "../hooks/useAuthToken";

const SIGNUP_MUTATION = gql`
  mutation signupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const history = useHistory();
  const { setAuthToken } = useAuthToken();

  const confirm = (data) => {
    const { token } = login ? data.login : data.signup;
    setAuthToken(token);
    history.push("/");
  };

  const [signupMutation] = useMutation(SIGNUP_MUTATION, {
    variables: { email, password, name },
    onCompleted: (data) => confirm(data),
  });
  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    variables: { email, password },
    onCompleted: (data) => confirm(data),
  });

  return (
    <div>
      <h4 className="mv3">{login ? "Login" : "Sign Up"}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Your email address"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <div
          className="pointer mr2 button"
          onClick={login ? loginMutation : signupMutation}
        >
          {login ? "login" : "create account"}
        </div>
        <div className="pointer button" onClick={() => setLogin(!login)}>
          {login ? "need to create an account?" : "already have an account?"}
        </div>
      </div>
    </div>
  );
};

export default Login;
