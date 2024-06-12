import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isValid } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const ServiceColumnDef = [
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
    accessorKey: "image",
    id: "Image",
    header: "Service Image",
    cell: ({ row }) => {
      const value = row.getValue("Image");
      return (
        <img
          className="object-contain rounded-lg max-w-[70px] h-1/3"
          src={`/ServiceImages/${value}`}
        />
      );
    },
  },
  {
    accessorKey: "name",
    id: "Service",
    header: "Service",
  },
  {
    accessorKey: "category",
    id: "Category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <div className="mx-auto text-center">
          <div className="text-md font-medium">{category.name}</div>
        </div>
      );
    },
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
    accessorKey: "price",
    header: "Price",
  },

  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => {
      return <div>{format(row.getValue("createdAt"), "MM/dd/yyyy")}</div>;
    },
  },
  {
    accessorKey: "available",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("available");

      return (
        <Badge variant={value === true ? "outline" : "default"}>
          {value.toString()}
        </Badge>
      );
    },
  },
];
