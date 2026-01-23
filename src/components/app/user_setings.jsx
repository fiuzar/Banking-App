import { updateProfile } from "@/server-functions/authentication"
import { useState } from "react"
import { Button } from "../ui/button"

export function UserProfileSettings({ user, setIsEditing }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-white pb-20 lg:pb-2 w-full max-w-md rounded-t-[32px] p-8 animate-in slide-in-from-bottom-full duration-300">
                <h3 className="text-xl font-black text-brand-dark mb-6">Edit Profile</h3>
                <form action={async (formData) => {
                    await updateProfile(formData);
                    setIsEditing(false);
                }} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-n-500">First Name</label>
                        <input
                            name="first_name"
                            className="w-full h-12 bg-secondary border-none rounded-xl px-4 mt-1 font-bold"
                            defaultValue={`${user?.first_name ?? ""}`}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-n-500">Last Name</label>
                        <input
                            name="last_name"
                            className="w-full h-12 bg-secondary border-none rounded-xl px-4 mt-1 font-bold"
                            defaultValue={`${user?.last_name ?? ""}`}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-n-500">Phone Number</label>
                        <input
                            name="phone"
                            className="w-full h-12 bg-secondary border-none rounded-xl px-4 mt-1 font-bold"
                            defaultValue={user?.phone ?? ""}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button type="button" onClick={() => setIsEditing(false)} variant="outline" className="flex-1 h-12 rounded-xl">Cancel</Button>
                        <Button type="submit" className="flex-1 h-12 rounded-xl btn-primary">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}