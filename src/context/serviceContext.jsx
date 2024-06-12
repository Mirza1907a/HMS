import { socket } from "@/socket";
import axios from "axios";
import {
  useEffect,
  useState,
  createContext,
  useReducer,
  useContext,
} from "react";

export const ServiceContext = createContext();

export const ServiceReducer = (state, action) => {
  switch (action.type) {
    case "SET_SERVICES":
      return {
        ...state,
        service: action.payload,
      };
    case "SET_CATEGORIES":
      return {
        ...state,
        category: action.payload.category,
      };
    case "CREATE_CATEGORY":
      return {
        ...state,
        category: [action.payload, ...state.category],
      };
    case "CREATE_SERVICE":
      return {
        ...state,
        service: [action.payload, ...state.service],
      };
    case "DELETE_TYPE":
      return {
        ...state,
        category: state.category.filter(
          (w) => w._id !== action.payload.deletedService._id
        ),
      };
    case "DELETE_SERVICE":
      return {
        ...state,
        service: state.service
          ? state.service.filter((w) => !action.payload.includes(w._id))
          : [],
      };
    default:
      return state;
  }
};
export const ServiceContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ServiceReducer, {
    service: [],
    category: [],
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get("/api/service");

        if (response.status === 200) {
          dispatch({ type: "SET_SERVICES", payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchService();
  }, []);
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const response = await axios.get("/api/serviceCategory");
        if (response.status === 200) {
          dispatch({ type: "SET_CATEGORIES", payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchServiceCategories();
  }, []);
  useEffect(() => {
    const newService = (service) => {
      dispatch({ type: "CREATE_SERVICE", payload: service });
    };

    const deleteService = (service) => {
      dispatch({ type: "DELETE_SERVICE", payload: service });
      console.log("service delete", service);
    };
    socket.on("newService", newService);
    socket.on("serviceDelete", deleteService);

    return () => {
      socket.off("newService", newService);
      socket.off("serviceDelete", deleteService);
    };
  }, [socket, dispatch]);

  console.log("serviceContext state: ", state);
  return (
    <ServiceContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);

  if (!context) {
    throw Error(
      "useServiceContext must be used inside an ServiceContextProvider"
    );
  }
  return context;
};
