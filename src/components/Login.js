import React, { useState, useContext } from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../Context/AuthProvider";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState();
  const history = useHistory();
  const { setAuthToken } = useContext(AuthContext);

  const confirm = (data) => {
    setError(null);

    const { token } = login ? data.login : data.signup;
    setAuthToken(token);
    history.push("/");
  };

  const [signupMutation] = useMutation(SIGNUP_MUTATION, {
    variables: { email, password, name },
    // onCompleted: (data, error) => confirm(data),
  });
  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    variables: { email, password },
    // onCompleted: (data) => confirm(data),
  });
  const onSubmit = () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Please fill out all fields");
    } else {
      if (login) {
        loginMutation()
          .then(({ data, errors }) => {
            if (!errors) {
              confirm(data);
            }
          })
          .catch(handleError);
      } else {
        signupMutation()
          .then(({ data, errors }) => {
            if (!errors) {
              confirm(data);
            }
          })
          .catch(handleError);
      }
    }
  };

  const handleError = (error) => {
    if (error.graphQLErrors[0]) {
      setError(error.graphQLErrors[0].message);
    }
    setPassword("");
  };

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
        <div className="pointer mr2 button" onClick={onSubmit}>
          {login ? "login" : "create account"}
        </div>
        <div className="pointer button" onClick={() => setLogin(!login)}>
          {login ? "need to create an account?" : "already have an account?"}
        </div>
      </div>
      {error && <p className="red">{error}</p>}
    </div>
  );
};

export default Login;
