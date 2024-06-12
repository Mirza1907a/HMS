import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  CheckCircledIcon,
  DotsVerticalIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { format, isValid } from "date-fns";
import { Copy } from "lucide-react";

import CopyToClipboard from "react-copy-to-clipboard";

export const TaskColumnDef = [
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
    accessorKey: "taskId",
    id: "taskId",
    header: "TaskId",
    cell: ({ row }) => {
      const taskId = row.getValue("taskId");

      return (
        <div className="flex items-center justify-between space-x-2">
          <span>{taskId}</span>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <DotsVerticalIcon />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <CopyToClipboard text={taskId}>
                    <div className="flex gap-5 flex-row justify-between items-center w-fit">
                      <Copy className="size-4" />
                      <span>Copy TaskId</span>
                    </div>
                  </CopyToClipboard>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "title",
    id: "Title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("Title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    id: "Description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate">
            {row.getValue("Description")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    id: "Priority",
    header: "Priority",
    cell: ({ row }) => {
      let bgColorClass;
      switch (row.getValue("Priority").toLowerCase()) {
        case "low":
          bgColorClass = "bg-green-600";
          break;
        case "medium":
          bgColorClass = "bg-yellow-500";
          break;
        case "high":
          bgColorClass = "bg-orange-500";
          break;
        case "very high":
          bgColorClass = "bg-red-600";
          break;
        default:
          bgColorClass = "bg-gray-400";
          break;
      }
      return (
        <Badge className={`pointer-events-none ${bgColorClass}`}>
          {row.getValue("Priority")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    id: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("Status");

      return (
        <div className="flex w-[100px] items-center">
          {status === "Pending" ? (
            <StopwatchIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          ) : (
            status === "Completed" && (
              <CheckCircledIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            )
          )}
          <span>{status}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "completedBy",
    id: "CompletedBy",
    header: "Completed By",
    cell: ({ row }) => {
      const completedBy = row.original.completedBy;

      if (completedBy) {
        return <Badge variant="secondary">{completedBy.username}</Badge>;
      } else {
        return <div>Not completed</div>;
      }
    },
  },
  {
    accessorKey: "assignedTo",
    id: "AssignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignedTo = row.original.assignedTo;
      const assignedAll = row.original.assignedAll;

      if (assignedTo && assignedTo.length > 0) {
        return (
          <div className="flex flex-row font-medium gap-1 max-w-sm overflow-auto text-sm">
            {assignedTo.map((staff) => (
              <Badge
                key={staff._id}
                className="flex flex-col items-center flex-wrap"
              >
                <span className="text-[10px]">{staff.username}</span>
                <span className="text-[8px]"> ({staff.role})</span>
              </Badge>
            ))}
          </div>
        );
      } else if (assignedAll) {
        return <Badge variant="outline">Assigned to all</Badge>;
      } else {
        return <div>Not assigned</div>;
      }
    },
  },

  {
    accessorKey: "deadlineDate",
    header: "Deadline Date",
    cell: ({ row }) => {
      return <div>{format(row.getValue("deadlineDate"), "MM/dd/yyyy")}</div>;
    },
    isVisible: false,
  },
  {
    accessorKey: "deadlineTime",
    header: "Deadline Time",
    isVisible: false,
  },
];
