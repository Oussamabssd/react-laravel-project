import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextPovider";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordCofirmationRef = useRef();

  const [errors, setErrors] = useState(null);
  const [created, setCreated] = useState(null);

  const { setUser, setToken } = useStateContext();

  const onsubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordCofirmationRef.current.value,
    };

    axiosClient
      .post("/signup", payload)
      .then((data) => {
        setUser(data.data.user);
        setToken(data.data.token);
        console.log(data.data.token);
        setErrors(null);
        setCreated("user created succesfully");
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 422) {
          setErrors(response.data);
        }
      });
  };

  return (
    <div>
      <div className="login-signup-form animated fadeInDown">
        <div className="form">
          {(errors && <div className="alert">{errors.message}</div>) ||
            (created && <div className="user_created">{created}</div>)}
          <h1 className="title">Create new account</h1>
          <form onSubmit={onsubmit}>
            <input
              ref={nameRef}
              type="text"
              id="full-name"
              placeholder="full name"
            />
            <input
              ref={emailRef}
              type="email"
              name=""
              id="email"
              placeholder="email"
            />
            <input
              ref={passwordRef}
              type="password"
              name=""
              id="password"
              placeholder="password"
            />
            <input
              ref={passwordCofirmationRef}
              type="password"
              name=""
              id="password-confirmation"
              placeholder="password confirmation"
            />

            <button className="btn btn-block">Signup</button>
            <p>
              Not registered?{" "}
              <Link className="link-to-login" to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
