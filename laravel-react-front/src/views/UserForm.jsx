import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import LoadingSpinner from "../components/LoadingSpinner";

export default function UserForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const navigate = useNavigate();

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient.get(`/users/${id}`).then(({ data }) => {
        setUser(data);
        setLoading(false);
      });
    }, []);
  }

  const onsubmit = (e) => {
    e.preventDefault();
    if (user.id) {
      console.log(user.id);
      axiosClient
        .put(`/users/${user.id}`, user)
        .then(() => {
          navigate("/users");
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            console.log(response.data);
          }
        });
    } else {
      console.log(user.id);
      axiosClient
        .post("/users", user)
        .then(() => {
          navigate("/users");
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            console.log(response.data);
          }
        });
    }
  };

  return (
    <>
      {user.id && <h1>Update User: {user.name}</h1>}
      {!user.id && <h1>New User:</h1>}
      <div className="card animated fadeInDown">
        {loading && <LoadingSpinner />}
        {!loading && (
          <form action="" onSubmit={onsubmit}>
            <input
              onChange={(ev) => setUser({ ...user, name: ev.target.value })}
              value={user.name}
              type="text"
              placeholder="Name"
            />
            <input
              onChange={(ev) => setUser({ ...user, email: ev.target.value })}
              value={user.email}
              type="email"
              placeholder="Email"
            />
            <input
              onChange={(ev) => setUser({ ...user, password: ev.target.value })}
              type="password"
              placeholder="Password"
            />
            <input
              onChange={(ev) =>
                setUser({ ...user, password_confirmation: ev.target.value })
              }
              type="password"
              placeholder="Password confirmation"
            />
            <button className="btn " onClick={() => onsubmit}>
              Save
            </button>
          </form>
        )}
      </div>
    </>
  );
}
