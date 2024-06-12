"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { TaskTableFacetedFilter } from "./TaskStatusFacetedFilter";
import { TaskTableViewOptions } from "./tast-table-options";

export const TaskTableToolbar = ({ table }) => {
  const isFiltered = table.getState().columnFilters.length > 0;

  const roomStatus = [
    {
      label: "Pending",
      value: "Pending",
    },
    {
      label: "Completed",
      value: "Completed",
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by task id..."
          value={table.getColumn("taskId")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("taskId")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("Status") && (
          <TaskTableFacetedFilter
            column={table.getColumn("Status")}
            title="Status"
            options={roomStatus}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <TaskTableViewOptions table={table} />
    </div>
  );
};
