import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Fingerprint, Smartphone } from "lucide-react";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

export function SecuritySetting() {
    return (
        <TabsContent value="security" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
                <CardDescription>Manage your passwords and authentication methods.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full"><KeyRound className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-medium">Transaction PIN</p>
                      <p className="text-xs text-muted-foreground">Required for all transfers</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
                
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full"><Fingerprint className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-medium">Biometric Login</p>
                      <p className="text-xs text-muted-foreground">Face ID or Fingerprint</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full"><Smartphone className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-muted-foreground">Secure your account with OTP</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
    )
}