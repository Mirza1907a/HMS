import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RoomStatusSelect } from "@/globalComponents/RoomStatusSelect";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { format, isValid } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const RoomColumnDef = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "images",
    id: "Image",
    header: "Room Image",
    cell: ({ row }) => {
      const images = row.original.images;
      const firstImage = images.length > 0 ? images[0].filepath : "";
      return (
        <img
          className="object-contain rounded-lg max-w-[70px] h-1/3"
          src={`/RoomImages/${firstImage}`}
          alt="Room"
        />
      );
    },
  },

  {
    accessorKey: "name",
    id: "Room Name",
    header: "Room Name",
  },
  {
    accessorKey: "status",
    id: "Status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("Status");
      const id = row.original._id;
      const { staff } = useStaffAuthContext();

      return (
        <>
          {staff ? (
            staff.role === "Housekeeper" ? (
              <RoomStatusSelect status={value} id={id} />
            ) : (
              <Badge variant={value === "vacant" ? "default" : "default"}>
                {value}
              </Badge>
            )
          ) : (
            <Badge variant={value === "vacant" ? "default" : "default"}>
              {value}
            </Badge>
          )}
        </>
      );
    },

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "availibility",
    header: "Availibility",
    cell: ({ row }) => {
      const value = row.getValue("availibility");

      return (
        <Badge variant={value === "available" ? "outline" : "default"}>
          {value}
        </Badge>
      );
    },
  },
  {
    accessorKey: "type.type",
    id: "type",
    header: "Category",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "roomNumber",
    id: "Room Number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Room Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="mx-auto text-center">
          <div className="text-md font-medium">{row.original.roomNumber}</div>
        </div>
      );
    },
    filter: "includes",
  },

  {
    accessorKey: "capacity",
    id: "Capacity",
    header: "Capacity",
  },

  {
    accessorKey: "description",
    id: "Description",
    header: "Description",
    cell: ({ row }) => {
      const value = row.getValue("Description");
      return <div className="text-md line-clamp-2 max-w-[400px]">{value}</div>;
    },
  },

  {
    accessorKey: "pricePerNight",
    header: "Price (Per Night)",
    cell: ({ row }) => {
      return (
        <div className="font-semibold">Rs.{row.getValue("pricePerNight")}</div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => {
      return <div>{format(row.getValue("createdAt"), "MM/dd/yyyy")}</div>;
    },
  },
];
