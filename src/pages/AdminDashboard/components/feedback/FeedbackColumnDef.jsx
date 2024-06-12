import { Badge } from "@/components/ui/badge";

import axios from "axios";

import { formatDistanceToNow } from "date-fns";

const updateStatus = async (id, show) => {
  try {
    const response = await axios.patch(`/api/feedback/update_status/${id}`, {
      show,
    });
  } catch (error) {
    console.log(error);
  }
};

export const FeedbackColumnDef = [
  {
    accessorKey: "guestId.fullName",
    id: "name",
    header: "Guest",
    cell: ({ row }) => {
      const value = row.original.guestId;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {value.fullName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "body",
    id: "body",
    header: "Feedback",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px]">{row.getValue("body")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "tags",
    id: "Tags",
    header: "Tags",
    cell: ({ row }) => {
      const value = row.original.tags;
      return (
        <div className="flex flex-wrap max-w-[300px]  gap-2">
          {value && value.length > 0 ? (
            value.map((v) => <Badge className="flex text-nowrap">{v}</Badge>)
          ) : (
            <span>No Tags</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    id: "Rating",
    header: "Rating",
    cell: ({ row }) => {
      const value = row.original.rating;
      return (
        <span className="font-medium text-left text-nowrap">
          {value} stars{" "}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      const rating = row.getValue(id).toString();
      return value.includes(rating);
    },
  },

  {
    accessorKey: "show",
    header: "Show to guests",
    cell: ({ row }) => {
      const value = row.getValue("show");
      const id = row.original._id;

      const handleChange = async (event) => {
        const newValue = event.target.checked;
        await updateStatus(id, newValue);
      };

      return (
        <div className="mx-auto grid  place-items-center">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={value}
            onChange={handleChange}
          />
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="text-xs">
          {formatDistanceToNow(new Date(row.getValue("createdAt")), {
            addSuffix: true,
          })}
        </div>
      );
    },
  },
];
