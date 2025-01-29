/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://192.168.0.107:5000/login", {
      username,
      password,
    });
    dispatch(loginSuccess(response.data));
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800">
      <div className="mb-3 relative flex">
        <h1 className="text-4xl font-bold text-slate-200 animate-bounce">
          Login To Chat
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-slate-700 shadow-md rounded-lg p-8 max-w-xs w-full"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border border-slate-600 rounded w-full py-2 px-3 text-slate-200 mb-4 bg-slate-800 focus:outline-none focus:border-slate-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-slate-600 rounded w-full py-2 px-3 text-slate-200 mb-4 bg-slate-800 focus:outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Login
        </button>
      </form>
      <div className="mt-4">
        <span className="text-slate-200">Don't have an account? </span>
        <Link to="/register" className="text-blue-400 hover:text-blue-500">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
