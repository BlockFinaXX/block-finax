import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  ArrowRight,
  Wallet,
  BarChart,
  Users,
} from "lucide-react";

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  linkText?: string;
  linkHref?: string;
}> = ({ title, value, icon, change, linkText, linkHref }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {change.positive ? (
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span
              className={change.positive ? "text-green-500" : "text-red-500"}
            >
              {change.value} since last month
            </span>
          </p>
        )}
        {linkText && linkHref && (
          <a
            href={linkHref}
            className="text-xs text-primary flex items-center mt-2 hover:underline"
          >
            {linkText}
            <ArrowRight className="ml-1 h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardStats: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Current Balance"
        value="$15,231.89"
        icon={<Wallet className="h-full w-full" />}
        change={{
          value: "+2.5%",
          positive: true,
        }}
        linkText="View transactions"
        linkHref="/wallet"
      />
      <StatCard
        title="Active Contracts"
        value="8"
        icon={<CreditCard className="h-full w-full" />}
        change={{
          value: "+3",
          positive: true,
        }}
        linkText="View contracts"
        linkHref="/contracts"
      />
      <StatCard
        title="Risk Score"
        value="32/100"
        icon={<BarChart className="h-full w-full" />}
        change={{
          value: "-5 points",
          positive: true,
        }}
        linkText="View risk details"
        linkHref="/risk"
      />
      <StatCard
        title="Network Partners"
        value="149"
        icon={<Users className="h-full w-full" />}
        change={{
          value: "+12",
          positive: true,
        }}
        linkText="View network"
        linkHref="/network"
      />
    </div>
  );
};

export default DashboardStats;
