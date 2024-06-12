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
import { RoomColumnDef } from "./RoomColumnDef";
import { useRoomContext } from "@/hooks/useRoomContext";
import DataTableToolbar from "./Data-Table-Toolbar";

export const RoomTable = () => {
  const { room } = useRoomContext();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const { user } = useAuthContextProvider();
  const { toast } = useToast();

  const tableInstance = useReactTable({
    columns: RoomColumnDef,
    data: room,
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
    getRowId: (row) => row?._id,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const deleteSelectedRooms = async (selectedKeys) => {
    console.log(selectedKeys);
    try {
      let roomIds;
      roomIds = Object.keys(selectedKeys);

      if (user.role !== "admin") {
        toast({
          title: "Unauthorized!",
          variant: "destructive",
        });
      }

      const response = await axios.post(`/api/room/deleteRoom/${user._id}`, {
        roomIds: roomIds,
      });

      if (response.status === 200) {
        toast({
          title: response.data.message,
          description: response.data.description,
        });
      }
    } catch (err) {
      console.error("Error deleting selected bookings:", err);
    }
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <h1 className="text-4xl font-semibold">Rooms</h1>
        <p className="text-muted-foreground text-sm">
          View and manage rooms effortlessly in one place.
        </p>
      </div>
      <DataTableToolbar table={tableInstance} />

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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={RoomColumnDef.length}
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
            onClick={() => deleteSelectedRooms(rowSelection)}
          >
            Delete <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
