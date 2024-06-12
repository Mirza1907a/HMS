import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StarIcon } from "lucide-react";
import { StarFilledIcon } from "@radix-ui/react-icons";

export const PickRating = ({ value, onChange }) => {
  const [hoveredValue, setHoveredValue] = useState(null);

  const labels = {
    1: "Very Poor💩",
    2: "Poor😶",
    3: "Fair🙄",
    4: "Good🙂‍",
    5: "Very Good🤩",
  };

  return (
    <div className="flex gap-3">
      {[1, 2, 3, 4, 5].map((index) => (
        <TooltipProvider delayDuration={2} skipDelayDuration={true} key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onChange(index)}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
                size="icon"
                className="w-fit bg-transparent shadow-none hover:bg-transparent"
              >
                <StarFilledIcon
                  className={` size-6 ${
                    index <= (hoveredValue || value)
                      ? "text-yellow-400"
                      : "text-gray-200"
                  } `}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{labels[index]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
