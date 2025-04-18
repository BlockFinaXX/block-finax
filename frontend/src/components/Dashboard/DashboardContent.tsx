"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Plus, Globe, Activity, ShieldCheck } from "lucide-react";

const DashboardContent = () => {
  const formatDate = () => {
    const date = new Date();
    const formattedDate = `Apr ${date.getDate()}, ${date.getFullYear()}, ${(
      date.getHours() % 12 || 12
    )
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} ${
      date.getHours() >= 12 ? "PM" : "AM"
    }`;
    return formattedDate;
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <Tabs defaultValue="financial">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="financial">Financial Dashboard</TabsTrigger>
            <TabsTrigger value="risk">Risk Intelligence</TabsTrigger>
          </TabsList>
          <div className="text-sm text-gray-500">
            Last updated: {formatDate()}
          </div>
        </div>

        <TabsContent value="financial" className="space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Trade Volume */}
            <Card className="bg-blue-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Total Trade Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">0.00 USD</p>
                    <p className="text-sm mt-1 flex items-center">
                      <Activity className="h-4 w-4 mr-1" />
                      Global trade activity
                    </p>
                  </div>
                  <div className="bg-blue-600 rounded-full p-3">
                    <Globe className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Trade Deals */}
            <Card className="bg-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Active Trade Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm mt-1">Current transactions</p>
                  </div>
                  <div className="bg-green-500 rounded-full p-3">
                    <Activity className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secured Transactions */}
            <Card className="bg-blue-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Secured Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-sm mt-1">Smart contract protected</p>
                  </div>
                  <div className="bg-blue-400 rounded-full p-3">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Ledger */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">
                  Transaction Ledger
                </CardTitle>
                <Button size="sm" className="bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  New Transaction
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Recent escrow contract activities and settlements
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Your transaction history will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-gray-500">
                  Risk assessment dashboard coming soon
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Analyze your trade portfolio risk factors
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
