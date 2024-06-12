import { useFeedbackContext } from "@/context/feedbackContext";
import { FeedbackCard } from "@/globalComponents/FeedbackCard";

export const Feedbacks = () => {
  const { feedback } = useFeedbackContext();
  return (
    <div className="grid md:px-20 px-10 py-32 gap-10">
      <div className="grid w-full gap-5 text-center mx-auto">
        <h1 className="text-4xl font-medium">Guest Feedback</h1>

        <p className="text-muted-foreground md:px-20  ">
          Welcome to our guest feedback section! Here, you can explore the
          experiences and opinions shared by our valued guests. Your feedback
          helps us continually improve our services and ensure every stay is
          exceptional. Feel free to browse through the comments and ratings to
          get a sense of what others have enjoyed or found helpful during their
          visit. Your insights are important to us and to future guests. Thank
          you for taking the time to share your thoughts!
        </p>
      </div>
      <div className="grid md:grid-cols-2 place-items-center gap-5">
        {feedback &&
          feedback.length > 0 &&
          feedback.map((f) => (
            <div className="grid col-span-1" key={f._id}>
              <FeedbackCard feedback={f} />
            </div>
          ))}
      </div>
    </div>
  );
};
