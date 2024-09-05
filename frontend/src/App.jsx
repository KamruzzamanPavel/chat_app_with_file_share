// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import AuthMiddleware from "./components/AuthMiddleware";
import Login from "./pages/Login";
import Register from "./pages/Rgister";
import LandingPage from "./pages/LandingPage";
import "./index.css";

import Layout from "./pages/Layout";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <AuthMiddleware>
                  <Layout />
                </AuthMiddleware>
              }
            />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
