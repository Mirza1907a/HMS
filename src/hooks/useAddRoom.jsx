import axios from "axios";
import { useState } from "react";
import { useAuthContextProvider } from "./useAuthContext";

export const useAddRoom = ({ reMount }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContextProvider();
  const [responseG, setResponseG] = useState(null);

  const InsertRoom = async (data, blogDetails) => {
    setIsLoading(false);
    setError(null);
    setResponseG(null);
    const formData = new FormData();
    formData.append("roomNumber", data.roomNumber);
    formData.append("type", data.type);
    formData.append("capacity", data.capacity);
    formData.append("description", data.description);
    formData.append("pricePerNight", data.pricePerNight);
    formData.append("multipleRooms", data.multipleRooms);
    data.images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("adminId", user._id);
    formData.append("blog", data.blog);

    if (data.blog) {
      formData.append("blogTitle", blogDetails.blogTitle);
      formData.append("blogDescription", blogDetails.blogDescription);
      formData.append("blogAuthor", blogDetails.author);
      formData.append("notifyGuests", blogDetails.notifyGuests);
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/room/add", formData);

      setIsLoading(false);

      if (response.status === 201) {
        setResponseG(response.data.message);
        reMount();
      }
    } catch (err) {
      setError(err.response.data.message);
      setIsLoading(false);
    }
  };
  return { InsertRoom, isLoading, responseG, error };
};
