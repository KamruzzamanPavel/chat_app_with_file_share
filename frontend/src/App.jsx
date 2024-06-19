// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import AuthMiddleware from "./components/AuthMiddleware";
import Login from "./pages/Login";
import Register from "./pages/Rgister";
// import Chat from "./components/Chat";
import "./index.css";
import Home from "./pages/Home";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <AuthMiddleware>
                  <Home />
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
