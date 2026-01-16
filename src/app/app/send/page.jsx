import React from "react";
import { ArrowLeft, Search, Info, CheckCircle2, QrCode, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SendMoneyPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-2xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Send Money</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recipient Details</CardTitle>
          <CardDescription>Enter the recipient&apos;s bank details or phone number.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* RECIPIENT SEARCH */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Search Recipient</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="recipient" placeholder="Name, @username, or Account No." className="pl-10" />
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {['JD', 'AM', 'ST'].map((initials, i) => (
                <Button key={i} variant="outline" className="flex items-center gap-2 rounded-full h-9">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">Recent</span>
                </Button>
              ))}
            </div>
          </div>

          {/* CURRENCY & AMOUNT */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <Label>Amount</Label>
              <Tabs defaultValue="naira" className="w-[140px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="naira">₦</TabsTrigger>
                  <TabsTrigger value="dollar">$</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-muted-foreground">₦</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-20 pl-12 text-4xl font-bold border-none bg-muted/30 focus-visible:ring-primary" 
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" /> Daily limit remaining: ₦2,450,000.00
            </p>
          </div>

          {/* NOTE */}
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Input id="note" placeholder="What's this for?" />
          </div>

          {/* CONFIRMATION MODAL TRIGGER */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700">
                Continue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Transaction</DialogTitle>
              </DialogHeader>
              <div className="py-6 space-y-4">
                <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">You are sending</p>
                  <h3 className="text-3xl font-bold">₦15,000.00</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recipient</span>
                    <span className="font-medium text-right">John Olumide Doe <br/><span className="text-xs text-muted-foreground">GTBank • 0123456789</span></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction Fee</span>
                    <span className="font-medium">₦10.00</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full bg-emerald-600">Confirm Payment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    </div>
  );
}