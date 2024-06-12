import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFeedbackContext } from "@/context/feedbackContext";
import { FeedbackCard } from "@/globalComponents/FeedbackCard";

export const GuestFeedbacks = () => {
  const { guestFeedback } = useFeedbackContext();

  const feedbackLength = guestFeedback && guestFeedback.length > 0;
  return (
    <Card className={`h-fit`}>
      <CardHeader>
        <CardTitle className="text-2xl ">Your feedbacks</CardTitle>
        <CardDescription>
          Here you can see your submitted feedbacks.
        </CardDescription>

        <CardContent
          className={` p-5 grid ${
            feedbackLength ? "grid-cols-2 gap-5 mx-auto " : "place-items-center"
          }`}
        >
          {feedbackLength ? (
            guestFeedback.map((g) => (
              <div key={g._id}>
                <FeedbackCard feedback={g} />
              </div>
            ))
          ) : (
            <div className="flex flex-row justify-center items-center">
              You haven't submitted any feedbacks yet.
            </div>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
};
