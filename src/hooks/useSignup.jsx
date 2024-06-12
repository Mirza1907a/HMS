import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseG, setResponseG] = useState(null);
  const navigate = useNavigate();

  const signup = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/user/signup", {
        first_name: data.firstName,
        last_name: data.lastName,
        contact: data.contactNumber,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });

      if (response.status === 200) {
        setResponseG(response.data);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setError(
          "No response received. Please check your internet connection."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
    }

    setIsLoading(false);
  };

  return { isLoading, signup, error, responseG };
};
