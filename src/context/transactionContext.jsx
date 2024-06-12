import { socket } from "@/socket";
import axios from "axios";
import { isToday } from "date-fns";
import {
  useEffect,
  useState,
  createContext,
  useReducer,
  useContext,
} from "react";

export const TransactionContext = createContext();

export const TransactionReducer = (state, action) => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      const todayTransactions = action.payload.filter((transaction) =>
        isToday(new Date(transaction.orderDate))
      );
      return {
        recentTransaction: todayTransactions,
        transaction: action.payload,
      };
    case "NEW_TRANSACTION":
      return {
        transaction: [action.payload, ...state.transaction],
        recentTransaction: [action.payload, ...state.recentTransaction],
      };

    default:
      return state;
  }
};
export const TransactionContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TransactionReducer, {
    transaction: [],
    recentTransaction: [],
  });
  useEffect(() => {
    const newTransaction = (transaction) => {
      dispatch({ type: "NEW_TRANSACTION", payload: transaction });
    };

    socket.on("newTransaction", newTransaction);

    return () => {
      socket.off("newTransaction", newTransaction);
    };
  }, [socket, dispatch]);

  console.log("TransactionContext state: ", state);
  return (
    <TransactionContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);

  if (!context) {
    throw Error(
      "useTransactionContext must be used inside an TransactionContextProvider"
    );
  }
  return context;
};
