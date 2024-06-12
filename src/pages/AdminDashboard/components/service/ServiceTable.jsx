import {
  flexRender,
  getCoreRowModel,
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Trash, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { useServiceContext } from "@/context/serviceContext";
import { ServiceColumnDef } from "./serviceColumnDef";
import { useAuthContextProvider } from "@/hooks/useAuthContext";

export const ServiceTable = () => {
  const { service } = useServiceContext();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const { user } = useAuthContextProvider();
  const { toast } = useToast();

  const tableInstance = useReactTable({
    columns: ServiceColumnDef,
    data: service,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row._id,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const deleteSelectedService = async (selectedKeys) => {
    console.log(selectedKeys);
    try {
      let serviceIds;
      serviceIds = Object.keys(selectedKeys);

      if (user.role !== "admin") {
        toast({
          title: "Unauthorized!",
          variant: "destructive",
        });
      }

      const response = await axios.post(`/api/service/delete/${user._id}`, {
        serviceIds: serviceIds,
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
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={tableInstance.getColumn("Service")?.getFilterValue() ?? ""}
          onChange={(event) =>
            tableInstance
              .getColumn("Service")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto flex items-center justify-between gap-2"
            >
              Visiblity <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {tableInstance
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
                colSpan={ServiceColumnDef.length}
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
            onClick={() => deleteSelectedService(rowSelection)}
          >
            Delete <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
