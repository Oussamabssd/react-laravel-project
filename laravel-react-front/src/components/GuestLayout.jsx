import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextPovider";

export default function GuestLayout() {
  const { token } = useStateContext();
  if (token) {
    return <Navigate to="/Dashboard" />;
  }
  return (
    <>
      <Outlet />
    </>
  );
}
