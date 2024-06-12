"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTableFacetedFilter from "./CategoryFacetedFilter";
import DataTableViewOptions from "./data-table-option";
import { useRoomTypeContext } from "@/hooks/useRoomTypeContext";
import StatusFacetedFilter from "./StatusFacetedFilter";

function DataTableToolbar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { roomTypes } = useRoomTypeContext();

  const roomStatus = [
    {
      label: "Vacant",
      value: "vacant",
    },
    {
      label: "Occupied",
      value: "occupied",
    },
    {
      label: "Cleaning",
      value: "cleaning",
    },
    {
      label: "Maintenance",
      value: "maintenance",
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by room name..."
          value={table.getColumn("Room Name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("Room Name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Room Type"
            options={roomTypes}
          />
        )}
        {table.getColumn("Status") && (
          <StatusFacetedFilter
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
      <DataTableViewOptions table={table} />
    </div>
  );
}

export default DataTableToolbar;
