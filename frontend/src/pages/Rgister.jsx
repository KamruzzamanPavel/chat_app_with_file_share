import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // State to control animation
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true); // Start animation
    await axios.post("http://192.168.0.107:5000/register", {
      username,
      password,
    });
    navigate("/login");
  };

  return (
    <div className="flex items-center flex-col  justify-center min-h-screen bg-slate-800">
      <h2 className="text-4xl font-bold text-slate-200 animate-bounce">
        Register
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-slate-700 shadow-md rounded-lg p-8 max-w-xs w-full"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border border-slate-600 rounded w-full py-2 px-3 text-slate-200 mb-4 bg-slate-800 focus:outline-none focus:border-blue-500 transition duration-300"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-slate-600 rounded w-full py-2 px-3 text-slate-200 mb-4 bg-slate-800 focus:outline-none focus:border-blue-500 transition duration-300"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full relative"
        >
          {isRegistering && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-2 w-2 bg-gray-300 rounded-full animate-typing">
                f
              </span>
              <span className="h-2 w-2 bg-gray-300 rounded-full animate-typing delay-100">
                f
              </span>
              <span className="h-2 w-2 bg-gray-300 rounded-full animate-typing delay-200">
                f
              </span>
            </span>
          )}
          Register
        </button>
      </form>
      <div className="mt-4">
        <span className="text-slate-200">Already have an account? </span>
        <Link to="/login" className="text-blue-400 hover:text-blue-500">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
