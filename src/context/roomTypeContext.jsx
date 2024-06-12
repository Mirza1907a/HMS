import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

export const RoomTypeContext = createContext();

export const roomTypesReducer = (state, action) => {
  switch (action.type) {
    case "SET_TYPE":
      return {
        roomTypes: action.payload,
      };
    case "CREATE_TYPE":
      return {
        roomTypes: [action.payload.roomType, ...state.roomTypes],
      };
    case "DELETE_TYPE":
      return {
        roomTypes: state.roomTypes.filter(
          (w) => w._id !== action.payload.deletedRoom._id
        ),
      };
    default:
      return state;
  }
};

export const RoomTypeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roomTypesReducer, {
    roomTypes: [],
  });

  useEffect(() => {
    const fetchroomTypes = async () => {
      try {
        const response = await axios.get("/api/roomType");
        if (response.status === 200) {
          dispatch({ type: "SET_TYPE", payload: response.data });
          console.log(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchroomTypes();
  }, []);
  console.log("RoomTypeContext state: ", state);
  return (
    <RoomTypeContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RoomTypeContext.Provider>
  );
};
