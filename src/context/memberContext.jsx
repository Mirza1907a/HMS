import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";

export const MemberContext = createContext();

export const MemberReducer = (state, action) => {
  switch (action.type) {
    case "SET_MEMBER":
      return {
        members: action.payload.members,
      };
    case "CREATE_MEMBER":
      return {
        members: [action.payload.member, ...state.members],
      };

    default:
      return state;
  }
};

export const MemberContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(MemberReducer, {
    members: null,
    loading: isLoading,
  });


  console.log("MemberContext: ",state)
  return (
    <MemberContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MemberContext.Provider>
  );
};
