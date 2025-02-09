import "./../index.css";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextPovider";

export default function DefaultLayout() {
  const { user, token, setUser, setToken } = useStateContext();
  if (!token) {
    return <Navigate to="/Login" />;
  }

  const onLogout = (e) => {
    e.preventDefault();
    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/Dashboard">Dashboard</Link>
        <Link to="/users">users</Link>
      </aside>
      <div className="content">
        <header>
          <div>header</div>
          <div>
            {user.name}{" "}
            <a className="btn-logout" onClick={onLogout} href="#">
              Logout
            </a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
