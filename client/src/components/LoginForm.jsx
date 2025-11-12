import { useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      login(response.data.token);
      setMessage("Login successful!");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Login failed!");
      } else {
        setMessage("Server not reachable!");
      }
      console.error("Error login:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Authorization</h2>

      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="current-password"
        placeholder="password"
        value={password}
        onChange={(e) => setPass(e.target.value)}
        required
      />

      <button type="submit">Login!</button>
      <p>{message}</p>
    </form>
  );
}
