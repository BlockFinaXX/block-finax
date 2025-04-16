import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { formatDate, formatCurrency } from "../../lib/utils";

type Transaction = {
  id: number;
  date: Date;
  type: "incoming" | "outgoing";
  status: "completed" | "pending" | "failed";
  amount: number;
  currency: string;
  description: string;
  counterparty: string;
};

// Sample transaction data
const transactions: Transaction[] = [
  {
    id: 1,
    date: new Date("2025-04-15T10:30:00"),
    type: "incoming",
    status: "completed",
    amount: 5000,
    currency: "USD",
    description: "Payment for contract #1234",
    counterparty: "ABC Corporation",
  },
  {
    id: 2,
    date: new Date("2025-04-14T15:45:00"),
    type: "outgoing",
    status: "completed",
    amount: 2500,
    currency: "USD",
    description: "Supplier payment",
    counterparty: "XYZ Suppliers Ltd.",
  },
  {
    id: 3,
    date: new Date("2025-04-13T09:15:00"),
    type: "incoming",
    status: "pending",
    amount: 7500,
    currency: "USD",
    description: "Invoice #9876 payment",
    counterparty: "Global Traders Inc.",
  },
  {
    id: 4,
    date: new Date("2025-04-12T11:20:00"),
    type: "outgoing",
    status: "failed",
    amount: 1200,
    currency: "USD",
    description: "Service fee payment",
    counterparty: "Finance Partners LLC",
  },
  {
    id: 5,
    date: new Date("2025-04-11T14:50:00"),
    type: "incoming",
    status: "completed",
    amount: 3200,
    currency: "USD",
    description: "Contract milestone payment",
    counterparty: "International Shipping Co.",
  },
];

const TransactionIcon: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => {
  // Status-based icon
  if (transaction.status === "completed") {
    return (
      <CheckCircle
        className={`h-4 w-4 ${
          transaction.type === "incoming" ? "text-green-500" : "text-primary"
        }`}
      />
    );
  } else if (transaction.status === "pending") {
    return <Clock className="h-4 w-4 text-yellow-500" />;
  } else if (transaction.status === "failed") {
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }

  // Type-based icon (fallback)
  return transaction.type === "incoming" ? (
    <ArrowDownLeft className="h-4 w-4 text-green-500" />
  ) : (
    <ArrowUpRight className="h-4 w-4 text-red-500" />
  );
};

const RecentTransactions: React.FC = () => {
  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No transactions found
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <TransactionIcon transaction={transaction} />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.counterparty} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${
                    transaction.type === "incoming"
                      ? "text-green-600 dark:text-green-500"
                      : ""
                  }`}
                >
                  {transaction.type === "incoming" ? "+" : "-"}
                  {formatCurrency(transaction.amount, transaction.currency)}
                </p>
                <p className="text-xs capitalize text-muted-foreground">
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <a href="/wallet" className="text-sm text-primary hover:underline">
          View all transactions
        </a>
      </div>
    </div>
  );
};

export default RecentTransactions;
