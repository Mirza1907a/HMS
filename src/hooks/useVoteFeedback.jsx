import { useFeedbackContext } from "@/context/feedbackContext";
import { useState } from "react";
import { useAuthContextProvider } from "./useAuthContext";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";

export const useVoteFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContextProvider();
  const { dispatch } = useFeedbackContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const voteFeedback = async (feedbackId, voteType) => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please log in to vote on feedback.",
          variant: "destructive",
          action: (
            <ToastAction
              onClick={() => navigate("/user/login")}
              altText="Log In"
            >
              Login
            </ToastAction>
          ),
        });
        return null;
      }
      const response = await axios.patch("/api/feedback/vote_feedback", {
        feedbackId: feedbackId,
        guestId: user._id,
        voteType,
      });

      if (response.status === 200) {
        dispatch({ type: "VOTE_FEEDBACK", payload: response.data });
      }
    } catch (error) {
      setError(error.message);
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, voteFeedback };
};
