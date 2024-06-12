import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { socket } from "@/socket";
import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

export const TaskContext = createContext();

export const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_TASK":
      return {
        ...state,
        task: action.payload.tasks,
      };
    case "SET_GUEST_TASKS":
      return {
        ...state,
        guestTasks: action.payload,
      };
    case "SET_WAKEUP_CALLS":
      return {
        ...state,
        wakeUpCalls: action.payload,
      };
    case "CREATE_TASK":
      return {
        ...state,
        task: state.task ? [action.payload, ...state.task] : [action.payload],
      };

    case "NEW_GUEST_TASK":
      return {
        ...state,
        guestTasks: state.guestTasks
          ? [action.payload, ...state.guestTasks]
          : [action.payload],
      };
    case "NEW_WAKEUP_CALL":
      return {
        ...state,
        wakeUpCalls: state.wakeUpCalls
          ? [action.payload, ...state.wakeUpCalls]
          : [action.payload],
      };

    case "SET_SEENBY":
      const updatedTasks = state.task.map((task) => {
        if (task._id === action.payload.taskId) {
          return { ...task, seenBy: action.payload.seenBy };
        }
        return task;
      });

      return {
        ...state,
        task: updatedTasks,
      };

    case "DELETE_TASK":
      return {
        task: state.task.filter((w) => w._id !== action.payload._id),
      };
    case "CLEAR_TASK":
      return {
        task: null,
      };

    case "MARK_ON_THE_WAY":
      const updatedMarked = state.guestTasks.map((task) => {
        if (task._id === action.payload._id) {
          return {
            ...task,
            seen: action.payload.seen,
          };
        }
        return task;
      });

      return {
        ...state,
        guestTasks: updatedMarked,
      };
    case "MARK_GUEST_COMPLETED":
      const updateComplete = state.guestTasks.map((task) => {
        if (task._id === action.payload._id) {
          return {
            ...task,
            completed: action.payload.completed,
            completedBy: action.payload.completedBy,
          };
        }
        return task;
      });

      return {
        ...state,
        guestTasks: updateComplete,
      };
    case "MARK_WAKEUP_CALL_COMPLETED":
      const updateWakeUpComplete = state.wakeUpCalls.map((task) => {
        if (task._id === action.payload._id) {
          return {
            ...task,
            status: action.payload.status,
          };
        }
        return task;
      });

      return {
        ...state,
        wakeUpCalls: updateWakeUpComplete,
      };
    case "MARK_COMPLETED":
      const updateStatus = state.task.map((task) => {
        if (task._id === action.payload.taskId) {
          return {
            ...task,
            status: action.payload.status,
            completedBy: action.payload.completedBy,
          };
        }
        return task;
      });

      return {
        ...state,
        task: updateStatus,
      };
    default:
      return state;
  }
};

export const TaskContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    task: [],
    guestTasks: [],
    wakeUpCalls: [],
  });
  const { staff, loading } = useStaffAuthContext();
  const { user } = useAuthContextProvider();

  useEffect(() => {
    const handleCreateTask = (newTask) => {
      dispatch({ type: "CREATE_TASK", payload: newTask });
    };

    socket.on("createTask", handleCreateTask);

    return () => {
      socket.off("createTask", handleCreateTask);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    const updateSeenByContext = (seenBy) => {
      console.log(seenBy);
      dispatch({ type: "SET_SEENBY", payload: seenBy });
    };

    const handleCompleted = (taskState) => {
      dispatch({ type: "MARK_COMPLETED", payload: taskState });
    };

    const newGuestTask = (task) => {
      dispatch({ type: "NEW_GUEST_TASK", payload: task });
    };
    const newWakeUpCall = (task) => {
      dispatch({ type: "NEW_WAKEUP_CALL", payload: task });
    };
    const markWakeUpAsCompleted = (task) => {
      dispatch({ type: "MARK_WAKEUP_CALL_COMPLETED", payload: task });
    };
    const markOnTheWay = (task) => {
      dispatch({ type: "MARK_ON_THE_WAY", payload: task });
    };
    const markGuestTaskCompleted = (task) => {
      dispatch({ type: "MARK_GUEST_COMPLETED", payload: task });
    };
    const deleteTask = (task) =>{
      dispatch({type: "DELETE_TASK",payload: task})
    }

    socket.on("taskCompleted", handleCompleted);
    socket.on("newGuestTask", newGuestTask);
    socket.on("newWakeupCall", newWakeUpCall);
    socket.on("deleteTask",deleteTask)
    socket.on("markWakeUpAsCompleted", markWakeUpAsCompleted);
    socket.on("taskMarkedAsSeen", updateSeenByContext);
    socket.on("markGuestTaskOTW", markOnTheWay);
    socket.on("markGuestTaskCompleted", markGuestTaskCompleted);

    return () => {
      socket.off("markGuestTaskCompleted", markGuestTaskCompleted);
      socket.off("taskCompleted", handleCompleted);
      socket.off("taskMarkedAsSeen", updateSeenByContext);
      socket.off("newWakeupCall", newWakeUpCall);
      socket.off("newGuestTask", newGuestTask);
      socket.off("markGuestTaskOTW", markOnTheWay);
    };
  }, [socket, staff, dispatch]);

  console.log("TaskContext state: ", state);

  return (
    <TaskContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
