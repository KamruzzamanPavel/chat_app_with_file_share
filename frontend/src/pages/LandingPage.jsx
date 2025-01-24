import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen  bg-slate-800 flex flex-col items-center justify-center px-4">
      <main className="flex flex-col md:flex-row items-center justify-center mt-5 space-y-8 md:space-y-0 md:space-x-8">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-bold text-slate-200 mb-6">
            Real Time Chat
          </h1>
          <p className="text-slate-400 mb-8">
            Connect with your friends and the world around you using our
            powerful chat bot.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center md:justify-start">
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
              Register
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center relative">
          {/* Custom graphic components */}
          <div className="hidden md:block relative w-full h-full">
            <div
              className="absolute top-0 right-8 w-24 h-24 bg-blue-500 rounded-full animate-[bounce_3s_infinite_ease-in-out]"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="absolute bottom-0 left-8 w-16 h-16 bg-pink-500 rounded-full animate-[bounce_3s_infinite_ease-in-out]"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-16 left-16 w-32 h-32 bg-indigo-500 rounded-lg animate-[spin_10s_linear_infinite]"
              style={{ transform: "rotate(45deg)" }}
            ></div>
          </div>
          <div className="block md:hidden relative w-full h-full">
            <div
              className="absolute top-0 left-4 w-20 h-20 bg-green-500 rounded-full animate-[bounce_3s_infinite_ease-in-out]"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="absolute bottom-0 right-4 w-14 h-14 bg-yellow-500 rounded-full animate-[bounce_3s_infinite_ease-in-out]"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-10 right-10 w-28 h-28 bg-red-500 rounded-lg animate-[spin_10s_linear_infinite]"
              style={{ transform: "rotate(45deg)" }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
