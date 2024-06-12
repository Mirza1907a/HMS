import { useFeedbackContext } from "@/context/feedbackContext";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { FeedbackTable } from "@/pages/AdminDashboard/components/feedback/FeedbackTable";
import axios from "axios";
import { useEffect } from "react";

export const StaffFeedbacks = () => {
  const { staff } = useStaffAuthContext();
  const { feedback, dispatch } = useFeedbackContext();
  useEffect(() => {
    const fetchFeedback = async () => {
      dispatch({ type: "CLEAR_FEEDBACKs" });
      try {
        const response = await axios("/api/feedback/get_feedback");

        if (response.status === 200) {
          dispatch({ type: "SET_FEEDBACKS", payload: response.data.feedbacks });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeedback();
  }, [staff]);
  return (
    <div className="grid p-5">
      <FeedbackTable />
    </div>
  );
};
