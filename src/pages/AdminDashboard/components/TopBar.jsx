import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TopBar = ({ children }) => {
    const navigate = useNavigate();
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        size="icon"
        className="h-7 w-7"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-3xl font-semibold tracking-tight sm:grow-0">
        {children}
      </h1>
    </div>
  );
};
