import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { socket } from "@/socket";
import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

export const FeedbackContext = createContext();

export const FeedbackReducer = (state, action) => {
  switch (action.type) {
    case "SET_FEEDBACKS":
      return {
        ...state,
        feedback: action.payload,
      };
    case "SET_GUESTS_FEEDBACKS":
      return {
        ...state,
        guestFeedback: action.payload,
      };
    case "NEW_FEEDBACK":
      return {
        guestFeedback: state.guestFeedback
          ? [action.payload, ...state.guestFeedback]
          : [action.payload],
      };
    case "REMOVE_FEEDBACK":
      return {
        ...state,
        feedback: state.feedback.filter(
          (item) => item._id !== action.payload._id
        ),
        error: null,
      };
    case "FEEDBACK_STATUS":
      const updatedFeedbackStatus = state.feedback.map((item) => {
        if (item._id === action.payload._id) {
          return {
            ...item,
            show: action.payload.show,
          };
        }
        return item;
      });
      return {
        ...state,
        feedback: updatedFeedbackStatus,
      };
    case "VOTE_FEEDBACK":
      if (state.feedback === null) {
        return state;
      }

      const updatedFeedback = action.payload;
      const updatedGuestFeedback = state.guestFeedback.map((item) => {
        if (item._id === updatedFeedback._id) {
          return {
            ...item,
            downvotedBy: updatedFeedback.downvotedBy,
            downvotes: updatedFeedback.downvotes,
            upvotedBy: updatedFeedback.upvotedBy,
            upvotes: updatedFeedback.upvotes,
          };
        }
        return item;
      });

      const updatedFeedbacks = state.feedback.map((item) => {
        if (item._id === updatedFeedback._id) {
          return {
            ...item,
            downvotedBy: updatedFeedback.downvotedBy,
            downvotes: updatedFeedback.downvotes,
            upvotedBy: updatedFeedback.upvotedBy,
            upvotes: updatedFeedback.upvotes,
          };
        }
        return item;
      });
      return {
        ...state,
        feedback: updatedFeedbacks,
        guestFeedback: updatedGuestFeedback,
      };

    case "CLEAR_FEEDBACKS":
      return {
        guestFeedback: null,
        feedback: null,
      };
    default:
      return state;
  }
};

export const FeedbackContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContextProvider();
  const [state, dispatch] = useReducer(FeedbackReducer, {
    feedback: null,
    guestFeedback: null,
  });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true);
      try {
        const response = await axios("/api/feedback/get_global_feedbacks");

        if (response.status === 200) {
          dispatch({ type: "SET_FEEDBACKS", payload: response.data.feedbacks });
        }
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      const fetchGuestFeedbacks = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `/api/feedback/get_guests_feedback/${user._id}`
          );
          if (response.status === 200) {
            dispatch({
              type: "SET_GUESTS_FEEDBACKS",
              payload: response.data.feedbacks,
            });
          }
        } catch (err) {
          console.error("Error fetching guest feedbacks:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchGuestFeedbacks();
    }
  }, [user]);

  useEffect(() => {
    const feedbackStatus = (feedback) => {
      dispatch({ type: "FEEDBACK_STATUS", payload: feedback });
    };
    const voteFeedback = (feedback) => {
      dispatch({ type: "VOTE_FEEDBACK", payload: feedback });
    };
    socket.on("feedbackStatus", feedbackStatus);
    socket.on("voteFeedback", voteFeedback);

    return () => {
      socket.off("voteFeedback", voteFeedback);
      socket.off("feedbackStatus", feedbackStatus);
    };
  }, [socket]);

  console.log("FeedbackContext: ", state);
  return (
    <FeedbackContext.Provider value={{ ...state, dispatch, isLoading }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedbackContext = () => {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw Error(
      "useFeedbackContext must be used inside FeedbackContext provider"
    );
  }
  return context;
};
