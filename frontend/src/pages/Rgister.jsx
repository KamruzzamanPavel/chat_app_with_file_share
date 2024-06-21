// // src/pages/Register.js
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("http://localhost:5000/register", {
//       username,
//       password,
//     });
//     navigate("/login");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded p-8 mb-4 max-w-xs w-full"
//       >
//         <h2 className="text-2xl font-bold mb-4">Register</h2>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Username"
//           className="border rounded w-full py-2 px-3 text-gray-700 mb-3"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="border rounded w-full py-2 px-3 text-gray-700 mb-3"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;
// src/pages/Register.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // State to control animation
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true); // Start animation
    await axios.post("http://localhost:5000/register", {
      username,
      password,
    });
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-700 shadow-md rounded-lg p-8 max-w-xs w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-slate-200">
          Register
        </h2>
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
              <span className="h-2 w-2 bg-gray-300 rounded-full animate-typing"></span>
              <span className="h-2 w-2 bg-gray-300 rounded-full animate-typing delay-100"></span>
              <span className="h-2 w-2 bg-gray-300 rounded-full animate-typing delay-200"></span>
            </span>
          )}
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
