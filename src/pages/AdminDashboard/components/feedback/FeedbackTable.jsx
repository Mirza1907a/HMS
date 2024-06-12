import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useAuthContextProvider } from "@/hooks/useAuthContext";

import { useMemberContext } from "@/hooks/useMemberContext";
import { Input } from "@/components/ui/input";
import { FeedbackColumnDef } from "./FeedbackColumnDef";
import { useFeedbackContext } from "@/context/feedbackContext";
import { FeedbackTableToolbar } from "./FeedbackTableToolbar";

export const FeedbackTable = () => {
  const { feedback } = useFeedbackContext();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const { user } = useAuthContextProvider();
  const { toast } = useToast();

  const tableInstance = useReactTable({
    columns: FeedbackColumnDef,
    data: feedback,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row) => row._id,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const deleteSelectedTasks = async (selectedKeys) => {
    console.log(selectedKeys);
    try {
      let taskIds;
      taskIds = Object.keys(selectedKeys);

      if (user.role !== "admin") {
        toast({
          title: "Unauthorized!",
          variant: "destructive",
        });
      }

      const response = await axios.post(`/api/task/delete`, {
        taskIds: taskIds,
      });

      if (response.status === 200) {
        toast({
          title: "Selected Tasks deleted!",
        });
      }
    } catch (err) {
      console.error("Error deleting selected bookings:", err);
    }
  };

  return (
    feedback && (
      <div className="grid gap-5">
        <div className="grid gap-2">
          <h1 className="text-4xl font-semibold">Feedbacks</h1>
          <p className="text-muted-foreground text-sm">
            View and manage feedbacks effortlessly in one place.
          </p>
        </div>

        <FeedbackTableToolbar table={tableInstance}/>

        <Table>
          <TableHeader>
            {tableInstance.getHeaderGroups().map((header) => (
              <TableRow key={header.id}>
                {header.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {tableInstance.getRowModel().rows?.length ? (
              tableInstance.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={FeedbackColumnDef.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center w-full justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => tableInstance.previousPage()}
            disabled={!tableInstance.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => tableInstance.nextPage()}
            disabled={!tableInstance.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className="flex flex-row justify-between items-center text-sm text-muted-foreground">
          <div>
            {tableInstance.getFilteredSelectedRowModel().rows.length} of{" "}
            {tableInstance.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          {tableInstance.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              className="flex items-center justify-between gap-3"
              onClick={() => deleteSelectedTasks(rowSelection)}
            >
              Delete <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    )
  );
};
