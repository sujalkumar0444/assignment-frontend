import React from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./components/Home";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Documentation from "./components/documentation";




function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<Register />} />
                <Route path="/api/docs" element={<Documentation />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute/>}>
                    <Route path="/" element={<Home />}>
                        <Route index element={<LandingPage />} />
                        {/* <Route path="poems" element={<Poems />} />
                        <Route path="settings" element={<UserSettings />} />
                        <Route path="sounds" element={<AllSounds />} />
                        <Route path="drawings" element={<AllDrawings />} /> */}
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
