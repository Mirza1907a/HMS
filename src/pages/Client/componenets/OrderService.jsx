import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useServiceContext } from "@/context/serviceContext";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useBookingContext } from "@/hooks/useBookingContext";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpRight, X } from "lucide-react";
import { formatPrice } from "@/utils/seperatePrice";

export const OrderService = () => {
  const { service: services } = useServiceContext();
  const { selectedBooking } = useBookingContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [ellipsisClicked, setEllipsisClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { user } = useAuthContextProvider();
  const { toast } = useToast();

  const filteredServices = services.filter((service) =>
    selectedServices.includes(service._id)
  );

  const handleEllipsisClick = (index) => {
    setEllipsisClicked((e) => !e);
    setActiveIndex(index);
  };
  const handleQuantityChange = (id, value) => {
    setQuantities({
      ...quantities,
      [id]: value,
    });
  };
  const calculateSubtotal = (service) => {
    const quantity = quantities[service._id] || 1;
    return quantity * service.price;
  };

  const calculateTotalPrice = () => {
    let totalWithoutTax = 0;
    let totalWithTax = 0;
    selectedServices.forEach((serviceId) => {
      const service = services.find((service) => service._id === serviceId);
      if (service) {
        const subtotal = calculateSubtotal(service);
        totalWithoutTax += subtotal;
        totalWithTax += subtotal * 1.12;
      }
    });
    return { totalWithoutTax, totalWithTax };
  };
  const { totalWithoutTax, totalWithTax } = calculateTotalPrice();

  const removeItem = (id) => {
    setSelectedServices(selectedServices.filter((_id) => _id !== id));
  };
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category.name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  useEffect(() => {
    console.log(quantities);
  }, [quantities]);

  const handleOrder = async () => {
    try {
      if (!user) {
        return null;
      }

      const response = await axios.post(
        `/api/orderService/order-service/${user._id}/${selectedBooking._id}`,
        {
          serviceIds: selectedServices,
          quantities: quantities,
        }
      );
      if (response.status === 200) {
        toast({
          title: "Services ordered successfully",
        });
        setSelectedServices([]);
      }
    } catch (error) {
      toast({
        title: "Oops something went wrong!",
        description: "Error ordering services. Please try again later!",
        variant: "destructive",
      });
    }
  };
  return (
    <>
      <Card className="grid w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Room Service</CardTitle>
          <CardDescription>Order room services from here.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-7 px-14">
          {Object.entries(servicesByCategory).map(
            ([category, categoryServices]) => (
              <Carousel
                key={category}
                opts={{
                  align: "start",
                }}
                className="w-full grid gap-2 max-w-6xl"
              >
                <h3 className="font-semibold  text-2xl">{category}</h3>
                <CarouselContent>
                  {categoryServices.map((service, index) => (
                    <CarouselItem
                      onClick={(e) => {
                        if (selectedServices.includes(service._id)) {
                          setSelectedServices(
                            selectedServices.filter((id) => id !== service._id)
                          );
                          setOpen(true);
                        } else {
                          setOpen(true);
                          setSelectedServices([
                            ...selectedServices,
                            service._id,
                          ]);
                        }
                      }}
                      key={service._id}
                      className="md:basis-1/2 <lg:basis-1/2></lg:basis-1/2> cursor-pointer"
                    >
                      <div className="p-1">
                        <Card className="relative">
                          <CardHeader className="size-fit pb-1">
                            <h4 className="font-medium text-lg line-clamp-1">
                              {service.name}
                            </h4>
                          </CardHeader>
                          <Separator/>
                          <CardContent className="grid group place-items-center size-full p-2 overflow-hidden">
                            <div className="size-fit duration-500 transition-all">
                              <img
                                src={`/ServiceImages/${service.image}`}
                                className="object-cover relative mx-auto h-[200px] w-[200px]"
                              />
                              <div className="rounded-lg absolute opacity-0 grid place-items-center group-hover:opacity-100 transition-opacity duration-200 inset-0 bg-overlay">
                                <Button className="bg-indigo-600 px-10 hover:bg-indigo-700">
                                  <ArrowUpRight className="size-5" />
                                  Order
                                </Button>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="grid gap-4">
                            <p
                              onClick={() => handleEllipsisClick(index)}
                              className={`${
                                ellipsisClicked && activeIndex === index
                                  ? ""
                                  : "line-clamp-2"
                              } cursor-pointer`}
                            >
                              {service.description}
                            </p>
                            <Separator/>
                            <p className="mx-auto">
                              Price:{" "}
                              <span className="font-semibold">
                                {formatPrice(service.price)}
                              </span>
                            </p>
                          </CardFooter>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )
          )}
        </CardContent>

        <Sheet modal={false} open={open} className="overflow-visible">
          <SheetContent className="p-0">
            <SheetHeader className="p-5">
              <SheetTitle className="flex flex-row justify-between">
                Selected Services
                <X
                  className="size-5 cursor-pointer"
                  onClick={() => setOpen(!open)}
                />
              </SheetTitle>
              <SheetDescription>
                Make changes to your selected services here. Click order when
                you're done.
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 p-5">
              <ScrollArea className="max-h-[200px] w-full">
                <div className="grid gap-4">
                  {selectedServices &&
                    filteredServices.map((service, index) => {
                      return (
                        <>
                          <div className="flex flex-row justify-between items-center">
                            <h1 className="font-semibold text-md">
                              {service.name}
                            </h1>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Cross2Icon
                                    className="cursor-pointer"
                                    onClick={() => removeItem(service._id)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove Item</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div
                            className="flex flex-row justify-between gap-3 items-center"
                            key={service._id}
                          >
                            <img
                              className="w-[50px] h-[50px] object-cover rounded-xl"
                              src={`/ServiceImages/${service.image}`}
                              alt={service.name}
                            />

                            <Label>Quantity:</Label>
                            <Input
                              type="number"
                              min="1"
                              className="w-fit"
                              value={quantities[service._id] || 1}
                              onChange={(e) =>
                                handleQuantityChange(
                                  service._id,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </>
                      );
                    })}
                </div>
              </ScrollArea>

              <div className="grid gap-3">
                <div className="font-semibold">Service Details</div>
                <ScrollArea className="max-h-[70px] gap-3">
                  <ul className="grid gap-3">
                    {selectedServices &&
                      filteredServices.map((service, index) => {
                        const subtotal = calculateSubtotal(service);

                        return (
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {service.name} x{" "}
                              <span className="font-semibold">
                                {quantities[service._id] || 1}
                              </span>
                            </span>
                            <span>Rs.{subtotal}</span>
                          </li>
                        );
                      })}
                  </ul>
                </ScrollArea>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      Rs.{formatPrice(totalWithoutTax)}
                    </span>
                  </li>

                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">12% on each item</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>Rs. {formatPrice(totalWithTax)}</span>
                  </li>
                </ul>
              </div>
            </div>

            <SheetFooter className="p-5">
              <Button
                onClick={handleOrder}
                disabled={!selectedServices.length > 0}
                type="submit"
                className="w-full"
              >
                Order
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Card>
    </>
  );
};
