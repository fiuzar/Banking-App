'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { Camera } from "lucide-react";

import { useContext, useState } from "react";
import { UserContext } from "@/server-functions/contexts";

export function UserSetting({ user_id }) {
    const { user, setUser } = useContext(UserContext);
    const [first_name, setFirstName] = useState(user.first_name || "");
    const [last_name, setLastName] = useState(user.last_name || "");
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [imagePreview, setImagePreview] = useState(user.profile_image || "/img/logo.png");

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <TabsContent value="profile" className="mt-0 space-y-6">
            <Card>
                <div className="flex gap-6 w-full items-center p-6 pb-0">
                    <div className="relative w-24 h-24 rounded-full bg-black overflow-hidden group">
                        <Image src={imagePreview} alt="Profile Image" width={96} height={96} className="w-24 h-24 rounded-full object-cover" />
                        <Input type="file" accept="image/*" className="absolute w-24 h-24 opacity-0 cursor-pointer rounded-full" onChange={handleImageChange} />
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8" />
                        </div>
                    </div>
                    <CardHeader className="flex-1">
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your profile details and contact info.</CardDescription>
                    </CardHeader>
                </div>

                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex gap-2">
                            <Input id="email" value={email} readOnly className="bg-muted" />
                            <Button variant="outline">Change</Button>
                        </div>
                    </div>
                    <Button className="mt-4">Save Changes</Button>
                </CardContent>
            </Card>
        </TabsContent>
    );
}