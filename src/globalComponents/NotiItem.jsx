import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useNotiContext } from "@/hooks/useNotiContext";
import { useNotiMarkAsSeen } from "@/hooks/useNotiMarkAsSeen";

export const NotiItem = ({ noti }) => {
  const { dispatch } = useNotiContext();
  const { handleNotiSeen } = useNotiMarkAsSeen();
  return (
    <DropdownMenuItem
      onClick={() => handleNotiSeen(noti._id)}
      key={noti._id}
      className={`px-0   ${!noti.seen ? "bg-gray-50 font-semibold" : "px-4"} ${
        noti.link && "cursor-pointer"
      }`}
    >
      <div className={`p-1 flex flex-row items-center`}>
        {!noti.seen && <Dot className="grid w-6 h-6 text-blue-400" />}
        <div className="grid gap-2">
          <h1 className="text-lg">{noti.title}</h1>

          <p className="text-xs">{noti.message}</p>
          <div className="flex text-xs">
            {formatDistanceToNow(new Date(noti.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>
    </DropdownMenuItem>
  );
};
