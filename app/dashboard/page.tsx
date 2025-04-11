"use client"

import MainDashboard from "@/components/MainDashboard";
import SideBar from "@/components/SideBar";
import { RedirectToSignUp, useAuth , useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";


export default function (){

    const { isLoaded: authLoaded, userId  } = useAuth();
    const { isLoaded: userLoaded, user } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (authLoaded && userLoaded) {
            setIsLoading(false);
        }
    }, [authLoaded, userLoaded]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#171717]">
                <div className="text-white  ">Loading...</div>
            </div>
        );
    }

    if (!user || !userId || !user.imageUrl || !user.username ) {
        return <RedirectToSignUp/>
    }

    return(
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#171717]">
            <SideBar username={user.username} imageUrl={user.imageUrl} userId={userId} type="collection"/>
            <MainDashboard userId={userId} username={user.username} collectionID="" type="collection"/>
        </div>
    )

}