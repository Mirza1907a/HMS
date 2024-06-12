import { LoadingSpinner } from "@/LoadingSpinner";
import { useEffect, useReducer, createContext } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        loading: false, // Set loading to false after user is logged in
      };
    case "UPDATE_DETAILS":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true, // Initialize loading state to true
  });

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    // Check if user data exists in localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "LOGIN", payload: user }); // Dispatch LOGIN action if user data exists
    } else {
      dispatch({ type: "LOGIN", payload: null }); // Dispatch LOGIN action with null payload if no user data
    }
  }, []);

  // Render loading state if user context is loading
  if (state.loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ ...state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
