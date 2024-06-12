import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import { Textarea } from "@/components/ui/textarea";
import { useServiceContext } from "@/context/serviceContext";
import { Checkbox } from "@/components/ui/checkbox";

export const AddService = () => {
  const [responseG, setResponseG] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { service, category, dispatch } = useServiceContext();
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [notify, setNotify] = useState(false);

  const { toast } = useToast();

  const submitService = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("notify", notify);
      formData.append("image", image);

      console.log(formData);
      const response = await axios.post("/api/service", formData);

      if (response.status === 201) {
        setResponseG(response.data);
        formik.resetForm();
      }
      setIsLoading(false);
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
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
        action: (
          <ToastAction altText="Try again" onClick={formik.handleSubmit}>
            Try again
          </ToastAction>
        ),
        position: "center",
      });
    }
  }, [error]);

  useEffect(() => {
    if (responseG) {
      toast({
        title: "Service Created!",
      });
    }
  }, [responseG]);
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
      price: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().trim().required("Name is required."),
      description: Yup.string().trim().required("Description is required."),
      price: Yup.string().trim().required("Price is required."),
      category: Yup.string().trim().required("Category is required."),
    }),
    onSubmit: (values) => {
      submitService(values);
    },
  });

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
  const handleNotify = () => {
    setNotify(!notify);
  };
  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <CardHeader>
          <CardTitle className="text-2xl">Add Service</CardTitle>
          <CardDescription>
            Please enter the Service details below to create a service.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Laundry"
              {...formik.getFieldProps("name")}
              required
            />

            {formik.touched.name && formik.errors.name && (
              <p className="text-red-600 m-0 text-xs">{formik.errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Description">Description</Label>
            <Textarea
              id="Description"
              type="text"
              {...formik.getFieldProps("description")}
              required
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.description}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Price">Price</Label>
            <Input
              id="Price"
              type="number"
              {...formik.getFieldProps("price")}
              required
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-red-600 m-0 text-xs">{formik.errors.price}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Select Service Category</Label>
            <Select onValueChange={(e) => formik.setFieldValue("category", e)}>
              <SelectTrigger className="w-100">
                <SelectValue
                  {...formik.getFieldProps("category")}
                  placeholder="Select a category"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  {category &&
                    category.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.category}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="picture">Image</Label>
            <Input
              type="file"
              onChange={handleImage}
              accept="image/png, image/gif, image/jpeg"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox checked={notify} onCheckedChange={handleNotify} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notify guests about this service?
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!formik.isValid || !formik.dirty || isLoading}
          >
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              <>Add Service</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
