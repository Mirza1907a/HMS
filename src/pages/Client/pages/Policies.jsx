import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import axios from "axios";
import { formatDate, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { HeroScreen } from "../componenets/HeroScreen";

export const ClientPolicies = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios("/api/policy");

        if (response.status === 200) {
          setPolicies(response.data.policies);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPolicies();
  }, []);
  return (
    <div className="grid size-full">
      <HeroScreen height={80}>
        <h1 className="text-6xl">Our policies</h1>
        <p className="text-2xl">Read our luxury hotel policies here.</p>
      </HeroScreen>
      <div className="grid py-10 justify-items-center gap-10 items-center mx-auto">
        <div className="grid px-5 md:grid-cols-3 gap-10 z-40">
          {policies && policies.length > 0 ? (
            policies.map((p) => (
              <div key={p._id}>
                <GuestPolicyCard p={p} />
              </div>
            ))
          ) : (
            <div className="text-center mx-auto font-semibold text-3xl">No policies available rn.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const GuestPolicyCard = ({ p, guest }) => {
  const [truncate, setTruncate] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{p.title}</CardTitle>
        <CardDescription
          onClick={() => setTruncate((e) => !e)}
          className={`cursor-pointer ${truncate ? "" : "line-clamp-4"}`}
        >
          {p.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="items-flex-between">
          <Badge>{p.category}</Badge>
          <Badge>{p.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
