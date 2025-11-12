import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function HomePage() {
  const { token, logout } = useContext(AuthContext);

  if (!token) {
    return <p>You're not autorized yet</p>;
  }

  return (
    <>
      Welcome to homePage!
      <button onClick={logout}> log out</button>
    </>
  );
}
