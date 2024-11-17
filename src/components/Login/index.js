import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import env from "../../env";
import Cookies from "js-cookie";
import { ClipLoader } from 'react-spinners';

function Login() {
  const navigate = useNavigate();
  const [checkingToken, setCheckingToken] = useState(true);
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const goToRegister = () => {
    navigate("/signup");
  };

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    if (token !== undefined) {
      navigate("/", { replace: true });
    } else {
      setCheckingToken(false);
    }
  }, [navigate]);

  const submitClicked = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const userDetails = { username, password };
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    try {
      const res = await axios.post(`${env.SERVER_URL}/api/login`, userDetails, options);
      const data = res.data;
  
      if (res.status === 200) {
        submitSuccess(data.jwtToken, data.role);
      } else {
        setIncorrectCredentials(true);
        setErrorMessage("Wrong credentials. Please try again."); 
      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data) {
        setErrorMessage(error.response.data); 
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
      setIncorrectCredentials(true);
    } finally {
      setLoading(false);
    }
  };

  const submitSuccess = (jwtToken) => {
    Cookies.set("jwtToken", jwtToken, {
      expires: 30,
      path: "/",
    });
    navigate("/", { replace: true });
  };

  if (checkingToken) {
    return null; 
  }

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div>
            <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-gray-800">
              Seamless Login for Exclusive Access
            </h2>
            <p className="text-sm mt-6 text-gray-800">
              Immerse yourself in a hassle-free login journey with our intuitively
              designed login form. Effortlessly access your account.
            </p>
            <p className="text-sm mt-12 text-gray-800">
              Don't have an account?{" "}
              <span 
                className="text-blue-600 font-semibold hover:underline ml-1"
                onClick={goToRegister}
              >
                Register here
              </span>
            </p>
          </div>
          <form className="max-w-md md:ml-auto w-full" onSubmit={submitClicked}>
            <h3 className="text-gray-800 text-3xl font-extrabold mb-8">Log in</h3>
            <div className="space-y-4">
              <div>
                <input
                  name="username"
                  type="text"
                  autoComplete="username"
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="!mt-8">
              <button
                type="submit"
                className={`w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white ${
                  username && password ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none' : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!username || !password}
              >
                {loading ? <ClipLoader color="#fff" size={20} /> : "Log in"}
              </button>
            </div>
            {incorrectCredentials && (
            <p className="mt-4 text-red-600 text-center">{errorMessage}</p>
          )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
