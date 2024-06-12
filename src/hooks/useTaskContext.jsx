import { useContext } from "react";
import { TaskContext } from "@/context/TaskContext";

export const useTaskContext = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw Error("useTaskContext must be used inside an TaskContextProvider");
  }

  return context;
};
