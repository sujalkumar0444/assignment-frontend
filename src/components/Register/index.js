import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import env from "../../env";
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";

function Register() {
  const navigate = useNavigate();
  const [checkingToken, setCheckingToken] = useState(true);
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const goToLogin = () => {
    navigate("/login");
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

    if (password !== confirmPassword) {
      setIncorrectCredentials(true);
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    const userDetails = { username, password };
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      if (!username || !password || !confirmPassword) {
        setIncorrectCredentials(true);
        setErrorMessage("All fields are required.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${env.SERVER_URL}/api/signup`,
        userDetails,
        options
      );
      const data = res.data;

      if (res.status === 200) {
        submitSuccess(data.jwtToken);
      } else {
        setIncorrectCredentials(true);
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);

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

  const isFormValid = username && password && confirmPassword && password === confirmPassword;

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div>
            <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-gray-800">
              Seamless Registration for Exclusive Access
            </h2>
            <p className="text-sm mt-6 text-gray-800">
              Join our platform with an easy registration process.
            </p>
            <p className="text-sm mt-12 text-gray-800">
              Already have an account?{" "}
              <span
                className="text-blue-600 font-semibold hover:underline ml-1"
                onClick={goToLogin}
              >
                Login here
              </span>
            </p>
          </div>
          <form className="max-w-md md:ml-auto w-full" onSubmit={submitClicked}>
            <h3 className="text-gray-800 text-3xl font-extrabold mb-8">Sign Up</h3>
            <div className="space-y-4">
              <div>
                <input
                  name="username"
                  type="text"
                  autoComplete="username"
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  name="confirmPassword"
                  type="password"
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="!mt-8">
              <button
                type="submit"
                className={`w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white ${
                  isFormValid
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isFormValid}
              >
                {loading ? <ClipLoader color="#fff" size={20} /> : "Sign Up"}
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

export default Register;
