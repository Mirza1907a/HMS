import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as Yup from "yup";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { StaffCombobox } from "@/components/ui/combobox";
import { useFormik, useFormikContext } from "formik";
import axios from "axios";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import Priorities from "@/utils/PriorityList";
import { socket } from "@/socket";
import { useTaskContext } from "@/hooks/useTaskContext";
import { useToast } from "@/components/ui/use-toast";

export function AddTask() {
  const [date, setDate] = useState(null);
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [assignAll, setAssignAll] = useState(false);
  const { user } = useAuthContextProvider();
  const { toast } = useToast();

  const handleSelectedStaffsChange = (staffIds) => {
    setSelectedStaffs(staffIds);
  };
  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    formik.setFieldValue("deadlineDate", selectedDate);
  };
  const handleSubmit = async (values) => {
    if (!user) {
      return null;
    }

    try {
      const response = await axios.post(
        "/api/task/create",
        {
          ...values,
          createdBy: user._id,
          ...(assignAll
            ? { assignedTo: null }
            : { assignedTo: selectedStaffs }),
          assignedAll: assignAll,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 201) {
        toast({
          title: response.data.message,
        });
      }
    } catch (err) {}
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      deadlineDate: date,
      deadlineTime: "",
      assignedTo: selectedStaffs,
      assignAll: assignAll,
      priority: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Title is required."),
      description: Yup.string().trim().required("Description is required."),
      deadlineDate: Yup.string().trim().required("Deadline date is required."),
      deadlineTime: Yup.string().trim().required("Deadline time is required."),
      priority: Yup.string().trim().required("Priority is required."),
    }),
    onSubmit: async (values) => {
      console.log(values);
      await handleSubmit(values);
    },
  });
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Add Task</CardTitle>
        <CardDescription>
          Create new tasks and assign them with ease using this form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Task Title</Label>
            <Input type="text" {...formik.getFieldProps("title")} />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-600 m-0 text-xs">{formik.errors.title}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="last-name">Description</Label>
            <Textarea rows="1" {...formik.getFieldProps("description")} />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.description}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Deadline date</Label>
            <Popover className="w-full">
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="grid gap-2">
              <h3 className="font-semibold text-sm">Deadline time</h3>

              <input type="time" className="w-full border-2 p-1 rounded-lg" {...formik.getFieldProps("deadlineTime")} />
            </div>
            {formik.errors.deadlineTime && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.deadlineTime}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Assign To: </Label>
            <StaffCombobox
              disabled={assignAll}
              onSelectedStaffsChange={handleSelectedStaffsChange}
            />
            <div className="flex flex-row items-center gap-2">
              <Switch
                checked={assignAll}
                onCheckedChange={() => setAssignAll((prev) => !prev)}
              />
              <Label>Assign to every staff</Label>
            </div>
          </div>

          <div className="gap-2 mt-2 grid">
            <Label>Priority</Label>
            <Select
              className="w-full"
              onValueChange={(e) => formik.setFieldValue("priority", e)}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  {...formik.getFieldProps("priority")}
                  placeholder="Select priority"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {Priorities.map((item, index) => (
                    <SelectItem value={item} key={index}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.priority && formik.errors.priority && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.priority}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!formik.isValid || !formik.dirty}
            className="w-full mt-5"
          >
            Create Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
