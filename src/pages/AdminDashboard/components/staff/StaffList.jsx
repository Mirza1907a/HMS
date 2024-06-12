import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteIcon, File, ListFilter, Trash2Icon } from "lucide-react";
import { useStaffContext } from "@/hooks/useStaffContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { UpdateIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import staffRole from "@/utils/staffRoleList";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CSVLink } from "react-csv";
import ExportCSV from "@/utils/ExportCSV";
import { EditStaff } from "./EditStaff";

export default function StaffList() {
  const [isLoading, setIsLoading] = useState(false);
  const [responseG, setResponseG] = useState(null);
  const [error, setError] = useState(null);
  const { staffs, dispatch } = useStaffContext();
  const { toast } = useToast();

  const updateStaffStatus = async ({ data }) => {
    setError(null);
    setResponseG(null);
    setIsLoading(true);
    try {
      const response = await axios.patch(
        "/api/staff/update_status/" + data.id,
        {
          status: data.status,
        }
      );

      if (response.status === 200) {
        dispatch({ type: "UPDATE_STAFF_STATUS", payload: response.data });
        setResponseG(response.data);
      }
    } catch (err) {}
    setIsLoading(false);
  };

  const updateStaffRole = async ({ data }) => {
    setError(null);
    setResponseG(null);
    setIsLoading(true);
    try {
      const response = await axios.patch("/api/staff/update_role/" + data.id, {
        role: data.role,
      });

      if (response.status === 200) {
        dispatch({ type: "UPDATE_STAFF_ROLE", payload: response.data });
        setResponseG(response.data);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setError(
          "No response received. Please check your internet connection."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setIsLoading(false);
  };

  const deleteStaff = async (id) => {
    setResponseG(null);
    setIsLoading(true);
    setError(null);
    try {
      setIsLoading(false);
      const response = await axios.delete("/api/staff/delete/" + id);

      if (response.status === 200) {
        dispatch({ type: "DELETE_STAFF", payload: response.data });
        setResponseG(response.data);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setError(
          "No response received. Please check your internet connection."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        description: `${error}`,
      });
    }
  }, [error]);

  useEffect(() => {
    if (responseG) {
      toast({
        title: responseG.message,
      });
    }
  }, [responseG]);

  const StaffStatus = ["active", "inactive"];
  return (
    <div className="grid gap-2">
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              Fulfilled
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <ExportCSV data={staffs} filename={"staff_data"}>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-sm"
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Export</span>
                </Button>
              </ExportCSV>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export data in CSV format</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle className="text-2xl">Staffs</CardTitle>
          <CardDescription>
            View and manage staff member's information effortlessly in one
            place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Date joined
                </TableHead>
                <TableHead className="hidden md:table-cell">Action</TableHead>
                <TableHead className="hidden md:table-cell">
                  Update role
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffs &&
                staffs.map((staff) => (
                  <TableRow className="bg-accent">
                    <TableCell>
                      <div className="font-medium">{staff.username}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {staff.role}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Select
                        onValueChange={(value) =>
                          updateStaffStatus({
                            data: { id: staff._id, status: value },
                          })
                        }
                        defaultValue={staff.status}
                      >
                        <SelectTrigger className="w-100">
                          <SelectValue placeholder={staff.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Statuses</SelectLabel>

                            {StaffStatus.map((status, index) => (
                              <SelectItem key={index} className="capitalize" value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(staff.createdAt, "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell className="text-left hidden md:table-cell">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => deleteStaff(staff._id)}
                              variant="outline"
                              size="icon"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete staff</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <EditStaff staff={staff} />
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Select
                        onValueChange={(value) =>
                          updateStaffRole({
                            data: { id: staff._id, role: value },
                          })
                        }
                        defaultValue={staff.role}
                      >
                        <SelectTrigger className="w-100">
                          <SelectValue placeholder={staff.role} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>

                            {staffRole.map((role, index) => (
                              <SelectItem key={index} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
