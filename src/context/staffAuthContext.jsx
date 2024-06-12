import { LoadingSpinner } from "@/LoadingSpinner";
import { useEffect, useReducer, createContext } from "react";

export const StaffAuthContext = createContext();

export const StaffAuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        staff: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        staff: null,
      };
    case "SET_ROLE":
      return {
        ...state,
        role: action.payload,
      };
    default:
      return state;
  }
};

export const StaffAuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StaffAuthReducer, {
    staff: null,
    loading: true,
  });

  const LogoutStaff = () => {
    localStorage.removeItem("staff");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const staff = JSON.parse(localStorage.getItem("staff"));

    if (staff) {
      dispatch({ type: "LOGIN", payload: staff });
    } else {
      dispatch({ type: "LOGIN", payload: null });
    }
  }, []);

  return (
    <>
      {state.loading ? (
        <LoadingSpinner />
      ) : (
        <StaffAuthContext.Provider value={{ ...state, dispatch, LogoutStaff }}>
          {children}
        </StaffAuthContext.Provider>
      )}
    </>
  );
};
