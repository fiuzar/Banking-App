'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "./ui/switch";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";

export function NotificationSetting({user_id}) {
    return (
        <TabsContent value="notifications" className="mt-0 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Decide how you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="flex flex-col gap-1">
                                <span>Transaction Alerts</span>
                                <span className="text-xs font-normal text-muted-foreground">Get notified of debits and credits.</span>
                            </Label>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="flex flex-col gap-1">
                                <span>Login Alerts</span>
                                <span className="text-xs font-normal text-muted-foreground">Alert me when my account is accessed.</span>
                            </Label>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="flex flex-col gap-1">
                                <span>Marketing & Promotions</span>
                                <span className="text-xs font-normal text-muted-foreground">News about new features and offers.</span>
                            </Label>
                            <Switch />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}