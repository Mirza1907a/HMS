import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeedbackContext } from "@/context/feedbackContext";
import { FeedbackCard } from "@/globalComponents/FeedbackCard";

export const YourFeedback = ({ bookingId }) => {
  const { guestFeedback } = useFeedbackContext();

  const filteredFeedback =
    guestFeedback &&
    guestFeedback.length > 0 &&
    guestFeedback.filter((f) => f.bookingId === bookingId);
  console.log(filteredFeedback);
  return (
    filteredFeedback &&
    filteredFeedback.length > 0 &&
    filteredFeedback.map((feedback) => (
      <Card className="grid gap-2">
        <CardHeader className="pb-2 px-4">
          <CardTitle>Your Feedback</CardTitle>
        </CardHeader>

        <FeedbackCard key={feedback._id} feedback={feedback} />
      </Card>
    ))
  );
};
