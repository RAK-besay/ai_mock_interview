"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { UploadCloud } from "lucide-react"

import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth, storage} from "@/firebase/client";
import {signIn, signUp} from "@/lib/actions/auth.action";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const authFormSchema = (type: FormType)=> {
    return z.object({
        name: type === 'sign-up'
            ? z.string().min(3, "Name must be at least 3 characters").max(50, "Name too long")
            : z.string().optional(),
        email: z.string()
            .min(1, "Email is required")
            .email("Please enter a valid email address"),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password too long")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[0-9]/, "Must contain at least one number"),
    })
}

const AuthForm = ({ type } : {type : FormType}) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);

    const [imageFile, setImageFile] = useState<File | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            email:"",
            password:"",
        },
        mode: "onChange",
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type === 'sign-up'){
                const toastId = toast.loading("Creating your account...");
                const {name, email, password} = values;

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                let uploadedImageUrl = "";
                if (imageFile) {
                    toast.loading("Uploading profile picture...", { id: toastId });
                    const fileRef = ref(storage, `avatars/${Date.now()}_${imageFile.name}`);
                    await uploadBytes(fileRef, imageFile);
                    uploadedImageUrl = await getDownloadURL(fileRef);
                }


                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                    imageUrl: uploadedImageUrl
                })

                if(!result?.success){
                    toast.error(result?.message, { id: toastId });
                    return;
                }
                toast.success('Account created successfully. Please sign in.', { id: toastId });
                router.push('/sign-in');

            } else {
                const toastId = toast.loading("Signing in...");
                const {email, password} = values;

                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredentials.user.getIdToken();

                if(!idToken){
                    toast.error("Sign in failed", { id: toastId })
                    return;
                }

                await signIn({ email, idToken })
                toast.success('Signed in successfully.', { id: toastId });
                router.push('/');
            }
        } catch (error: any) {
            console.log(error);
            toast.error(`There was an error creating your account. Please try again.`);
        }
    }

    const isSignIn= type === 'sign-in';

    return (
        <div  className="card-border lg:min-w-[566px]">
            <div  className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image  src="/logo.svg" alt="logo" height={32} width={38}/>
                    <h2 className="text-primary-100">DevMock</h2>
                </div>

                <h3 className="text-center">Practice Job Interview with AI</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your Name"/>
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your Email Address"
                            type="email"/>

                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter your Password"
                            type="password"/>

                        {!isSignIn && (
                            <div className="flex flex-col gap-2 mt-2">
                                <label className="text-[14px] font-medium leading-none text-white ml-1">
                                    Profile Picture
                                </label>

                                <label
                                    htmlFor="profile-upload"
                                    className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-700 bg-dark-200 px-3 py-2 text-sm font-medium text-gray-400 hover:opacity-80 transition-all"
                                >
                                    <UploadCloud className="w-5 h-5 text-gray-400" />
                                    <span className="truncate max-w-[200px]">
                                        {imageFile ? imageFile.name : "Upload an image"}
                                    </span>
                                </label>

                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <Button className="btn w-full mt-4" type="submit">
                            {isSignIn ? 'Sign in' : 'Create an Account'}
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? 'No account yet?' : 'Have an account already?'}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
                        {isSignIn ? 'Sign up' : 'Sign in'}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm;