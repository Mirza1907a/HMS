import { TopBar } from "../components/TopBar";
import { useEffect } from "react";
import { useMemberContext } from "@/hooks/useMemberContext";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { GuestTable } from "../components/guest/GuestTable";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

export const Guests = () => {
  const { dispatch: memberDispatch } = useMemberContext();
  const { user } = useAuthContextProvider();
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("/api/user/members");
        if (response.status === 200) {
          memberDispatch({ type: "SET_MEMBER", payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMembers();
  }, [user]);
  return (
    <>
      <TopBar>Guests</TopBar>
      <Card className="p-5">
        <CardContent>
          <GuestTable />
        </CardContent>
      </Card>
    </>
  );
};
