import axios from "axios";
import { useNotiContext } from "./useNotiContext";

export const useNotiMarkAsSeen = () => {
    const {dispatch} = useNotiContext();
  const handleNotiSeen = async (id) => {
    try {
      const response = await axios.patch(`/api/notis/markSeen/${id}`);

      if (response.status === 200) {
        dispatch({ type: "SET_NOTI_SEEN", payload: response.data });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {handleNotiSeen}
};
