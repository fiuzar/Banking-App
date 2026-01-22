import { TabsContent } from "../ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Mail, Phone } from "lucide-react"
import { Button } from "../ui/button"

export function SupportSetting({user_id}) {
    return (
        <TabsContent value="support" className="mt-0 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Help & Support</CardTitle>
                    <CardDescription>Get in touch with us 24/7.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col gap-2">
                        <Mail className="h-5 w-5" />
                        Email Support
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col gap-2">
                        <Phone className="h-5 w-5" />
                        Call Help Desk
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
    )
}