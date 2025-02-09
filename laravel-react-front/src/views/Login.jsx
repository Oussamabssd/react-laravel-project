import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextPovider";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);

  const onsubmit = (e) => {
    e.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient
      .post("/login", payload)
      .then((data) => {
        console.log(data);
        setUser(data.data.user);
        setToken(data.data.token);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 422) {
          setErrors(response.data);
          console.log(response);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        {errors && <div className="alert">{errors.message}</div>}
        <h1 className="title">Login into your account</h1>
        <form onSubmit={onsubmit}>
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
          <button className="btn btn-block">Login</button>
          <p>
            Already registered?{" "}
            <Link className="link-to-signup" to="/signup">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
