'use client';

import React, { useEffect, useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Camera, Lock, Mail, User as UserIcon, Edit2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { getCurrentUser, updateUserProfile } from '@/lib/actions/auth.action';

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    password: z.string().optional(),
});

const ProfilePage = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editingField, setEditingField] = useState<'name' | 'email' | 'password' | null>(null);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    form.reset({
                        name: user.name || "Developer",
                        email: user.email || "",
                        password: "",
                    });
                    if (user.imageUrl) setImagePreview(user.imageUrl);
                }
            } catch (error) {
                console.error("Failed to load user data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const toastId = toast.loading("Saving your changes...");

        try {
            let uploadedImageUrl = undefined;

            if (imageFile) {
                toast.loading("Uploading profile picture...", { id: toastId });
                const fileRef = ref(storage, `avatars/${Date.now()}_${imageFile.name}`);
                await uploadBytes(fileRef, imageFile);
                uploadedImageUrl = await getDownloadURL(fileRef);
            }

            const result = await updateUserProfile({
                name: values.name,
                password: values.password,
                imageUrl: uploadedImageUrl,
            });

            if (result.success) {
                toast.success(result.message, { id: toastId });
                if (values.password) form.setValue('password', '');
                setEditingField(null);
                setImageFile(null);

                router.push('/');
            } else {
                toast.error(result.message, { id: toastId });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Something went wrong. Please try again later.", { id: toastId });
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center text-white">Loading profile...</div>;

    const renderEditableRow = (
        fieldName: 'name' | 'email' | 'password',
        label: string,
        icon: React.ReactNode,
        currentValue: string | undefined,
        isPassword = false,
        allowEdit = true
    ) => {
        const isEditing = editingField === fieldName;

        return (
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-dark-300/30 border border-gray-800/50 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-300">
                        {icon} <span className="font-semibold text-sm">{label}</span>
                    </div>
                    {allowEdit && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingField(isEditing ? null : fieldName)}
                            className={isEditing ? "text-red-400 hover:text-red-300 hover:bg-red-950/30" : "text-primary-200 hover:text-primary-100 hover:bg-primary-900/30"}
                        >
                            {isEditing ? <><X className="w-4 h-4 mr-1"/> Cancel</> : <><Edit2 className="w-4 h-4 mr-1"/> Edit</>}
                        </Button>
                    )}
                </div>

                {isEditing ? (
                    <div className="mt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                        <FormField
                            control={form.control}
                            name={fieldName}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type={isPassword ? "password" : "text"}
                                            className="bg-dark-100 border-gray-700 h-11 focus-visible:ring-primary-200"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>
                ) : (
                    <div className="text-white font-medium text-lg mt-1">
                        {isPassword ? "••••••••" : (currentValue || "Not set")}
                        {!allowEdit && <p className="text-xs text-gray-500 mt-2 font-normal">Email address cannot be changed.</p>}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-12">

            <div className="w-full mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Account Settings</h1>
                    <p className="text-gray-400">Manage your personal information and security preferences.</p>
                </div>
                <Link href="/" className="text-sm font-semibold text-primary-200 hover:underline">
                    ← Back to Dashboard
                </Link>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">

                    <Card className="bg-dark-200 border-gray-800 text-white shadow-xl overflow-hidden rounded-2xl">
                        <div className="h-24 w-full bg-gradient-to-r from-primary-200/40 via-purple-500/20 to-dark-200"></div>
                        <CardContent className="pt-0 relative px-6 md:px-10 pb-8">

                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 mb-10">
                                <div className="relative group cursor-pointer">
                                    <Avatar className="h-32 w-32 border-4 border-dark-200 shadow-2xl bg-dark-300">
                                        <AvatarImage src={imagePreview || "/user-avatar.png"} alt="Profile" className="object-cover" />
                                        <AvatarFallback className="text-4xl font-bold">U</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                    {/* The hidden file input! */}
                                    <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                <div className="text-center sm:text-left mb-2">
                                    <h2 className="text-2xl font-bold">{form.getValues("name") || "Your Profile"}</h2>
                                    <p className="text-sm text-gray-400">Click the avatar to upload a new photo.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {renderEditableRow('name', 'Full Name', <UserIcon className="w-4 h-4 text-primary-200"/>, form.getValues('name'))}
                            </div>

                        </CardContent>
                    </Card>

                    <Card className="bg-dark-200 border-gray-800 text-white shadow-xl rounded-2xl">
                        <CardHeader className="border-b border-gray-800 pb-4 mb-4">
                            <CardTitle className="text-xl flex items-center gap-2 text-white">
                                <Lock className="w-5 h-5 text-primary-200" /> Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {renderEditableRow('email', 'Email Address', <Mail className="w-4 h-4 text-primary-200"/>, form.getValues('email'), false, false)}
                            {renderEditableRow('password', 'Password', <Lock className="w-4 h-4 text-primary-200"/>, form.getValues('password'), true)}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4 pb-12">
                        <Button type="submit" className="bg-primary-200 hover:bg-primary-200/80 text-dark-100 font-bold px-10 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-105">
                            Save Changes
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default ProfilePage;