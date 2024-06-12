import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useState } from "react";
import { PickRating } from "./PickRating";
import axios from "axios";
import { useBookingContext } from "@/hooks/useBookingContext";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFeedbackContext } from "@/context/feedbackContext";

export function FeedbackModal({ children, open, setOpen }) {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const { selectedBooking, dispatch } = useBookingContext();
  const { dispatch: feedbackDispatch } = useFeedbackContext();
  const { user } = useAuthContextProvider();
  const { toast } = useToast();
  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const submitFeedback = async () => {
    setIsLoading(false);
    try {
      setIsLoading(true);
      if (!user) {
        setIsLoading(false);
        return null;
      }
      if (selectedBooking.feedback) {
        toast({
          title: "You have already submitted the feedback!",
        });
        return null;
      }
      const response = await axios.post("/api/feedback/create_feedback", {
        guestId: user._id,
        roomId: selectedBooking.room._id,
        bookingId: selectedBooking._id,
        body: feedback,
        rating: rating,
        tags: selectedTags,
      });

      if (response.status === 201) {
        toast({
          title: "Feedback submitted!",
          description: "Thank you for your contribution!",
        });
        setOpen(!open);
        setIsLoading(false);
        setFeedback("");
        setSelectedTags([]);
        setRating(null);
        dispatch({
          type: "UPDATE_FEEDBACK_AND_PAID",
          payload: response.data.booking,
        });
        feedbackDispatch({
          type: "NEW_FEEDBACK",
          payload: response.data.populatedFeedback,
        });
      }
    } catch (err) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh something went wrong!",
        description: err.response.data.message,
      });
    }
    setIsLoading(false);
  };

  const tags = [
    "Efficient check-in",
    "Friendly staff",
    "Clean rooms",
    "Comfortable beds",
    "Good location",
    "Excellent service",
    "Delicious food",
    "Great amenities",
    "Relaxing atmosphere",
    "Value for money",
    "Convenient parking",
    "Free Wi-Fi",
    "Beautiful view",
    "Family-friendly",
    "Pet-friendly",
  ];

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave A Feedback</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve. Let us know how we did!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4">
            <Label htmlFor="feedback" className="text-justify text-md">
              Feedback:
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="col-span-3"
              placeholder="Your comment"
            />
          </div>

          <div className="flex flex-row flex-wrap gap-2 w-full">
            {tags.map((t, index) => (
              <Badge
                className={`w-fit cursor-pointer flex flex-row items-center gap-2 ${
                  selectedTags.includes(t)
                    ? "bg-teal-500 text-white"
                    : "bg-white border-teal-500 text-teal-500"
                } hover:bg-`}
                key={index}
                onClick={() => handleTagClick(t)}
              >
                {t}
                {selectedTags.includes(t) && (
                  <X
                    onClick={() => handleTagClick(t)}
                    className="size-3.5  text-gray-100"
                  />
                )}
              </Badge>
            ))}
          </div>
          <div className="grid gap-4">
            <Label htmlFor="feedback" className="text-justify text-md">
              Please rate your experience with us
            </Label>

            <PickRating value={rating} onChange={handleRatingChange} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            onClick={submitFeedback}
            disabled={!rating || isLoading || !feedback}
            className="flex gap-2"
            type="submit"
          >
            Save changes{" "}
            {isLoading && <ReloadIcon className="animate-spin size-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
