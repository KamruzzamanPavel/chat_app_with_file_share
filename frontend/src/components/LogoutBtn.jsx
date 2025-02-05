import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { clearMessage } from "../store/messageSlice";
import { useDispatch, useSelector } from "react-redux";
const serverIP = `${window.location.protocol}//${window.location.hostname}:5000`;
import axios from "axios";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    setShowConfirmModal(false);
    try {
      if (!token) {
        console.log("User is not logged in");
        return;
      }

      const response = await axios.post(
        `${serverIP}/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        dispatch(logout());
        dispatch(clearMessage());
        navigate("/landing");
        console.log("Logged out successfully");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const openModal = () => setShowConfirmModal(true);
  const closeModal = () => setShowConfirmModal(false);

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Logout
      </button>

      {/* Logout Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Are you sure you want to logout?
            </h2>

            <div className="flex ">
              <button
                onClick={closeModal}
                className="px-4 py-2 mr-2 bg-gray-400 text-white rounded hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 ml-auto py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutBtn;
