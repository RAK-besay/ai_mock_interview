import React from 'react'
import Agent from "@/components/Agent";
import {getCurrentUser} from "@/lib/actions/auth.action";


const Page = async () => {
    const user = await getCurrentUser();
    if (!user) {
        return <div className="text-white mt-10 text-center">Please log in to generate an interview.</div>;
    }
    return (
        <>
            <h3>Interview Generation</h3>

            <Agent userName={user?.name} userId={user?.id} type="generate"/>
        </>
    )
}

export default Page
