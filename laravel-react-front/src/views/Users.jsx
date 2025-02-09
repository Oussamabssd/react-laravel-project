import "./../index.css";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const deleteUser = (user) => {
    if (!window.confirm(`Are you sure to delete ${user.name} ?`)) {
      return;
    }
    axiosClient
      .delete(`/users/${user.id}`)
      .then(() => {
        alert("user deleted succesfully");
        setLoading(true);
        getUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUser = () => {
    axiosClient
      .get("/users")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const usersList = users.map((user) => {
    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.created_at}</td>
        <td>
          <Link to={`/users/${user.id}`} className="btn-edit">
            edit
          </Link>
          &nbsp;
          <button className="btn-delete" onClick={() => deleteUser(user)}>
            delete
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <div className="users">
        <h1>User</h1>
        <Link to="/Users/new" className="btn-add">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>name</th>
              <th>email</th>
              <th>create date</th>
              <th>action</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan={5} className="text-center">
                  <LoadingSpinner />
                </td>
              </tr>
            </tbody>
          )}
          {!loading && <tbody>{usersList}</tbody>}
        </table>
      </div>
    </div>
  );
}
