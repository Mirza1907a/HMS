import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Link } from "react-router-dom";
import { useTransactionContext } from "@/context/transactionContext";
import { formatDate, formatDistanceToNow } from "date-fns";

export default function RecentTransactions() {
  const { recentTransaction } = useTransactionContext();
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Recent transactions from your store.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link to="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="">Description</TableHead>
              <TableHead className="text-justify">Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransaction && recentTransaction.length > 0 ? (
              recentTransaction.map((transaction) => (
                <TableRow>
                  <TableCell>
                    <div className="font-medium">
                      {transaction.user.fullName}
                    </div>
                    <div className=" text-sm text-muted-foreground ">
                      {transaction.user.email}
                    </div>
                  </TableCell>
                  <TableCell className=" ">{transaction.description}</TableCell>
                  <TableCell className="font-semibold">
                    Rs.{transaction.cost.toString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDistanceToNow(new Date(transaction.orderDate), {
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <div>No Recent transactions.</div>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
