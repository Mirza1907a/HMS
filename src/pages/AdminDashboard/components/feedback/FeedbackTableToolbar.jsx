"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeedbackTableFacetedFilter } from "./FeedbackRatingFacetedFilter";
import { FeedbackTableViewOptions } from "./FeedbackTableOptions";

export const FeedbackTableToolbar = ({ table }) => {
  const isFiltered = table.getState().columnFilters.length > 0;

  const rating = [
    {
      label: "1 star",
      value: "1",
    },
    {
      label: "2 star",
      value: "2",
    },
    {
      label: "3 star",
      value: "3",
    },
    {
      label: "4 star",
      value: "4",
    },
    {
      label: "5 star",
      value: "5",
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by guest name..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("Rating") && (
          <FeedbackTableFacetedFilter
            column={table.getColumn("Rating")}
            title="Rating"
            options={rating}
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
      <FeedbackTableViewOptions table={table} />
    </div>
  );
};
