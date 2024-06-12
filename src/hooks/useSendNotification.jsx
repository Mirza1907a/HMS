import axios from "axios";
import { useState } from "react";
import { useAuthContextProvider } from "./useAuthContext";
import { useToast } from "@/components/ui/use-toast";

export const useSendNotification = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContextProvider();
  const [responseG, setResponseG] = useState("");
  const { toast } = useToast();

  const sendNotification = async (values) => {
    setError(null);
    setResponseG(null);
    setIsLoading(false);
    if (!user) {
      return null;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/notis/create/${user._id}`,
        {
          ...values,
          sentBy: user._id,
          ...(values.sendAll
            ? { sendTo: null }
            : { sendTo: values.selectedRecipients }),
          sendAll: values.sendAll,
        },

        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        setResponseG(response);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Server Error");
      } else if (err.request) {
        setError("Network Error");
      } else {
        setError("Unknown Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { sendNotification, isLoading, error, responseG };
};
