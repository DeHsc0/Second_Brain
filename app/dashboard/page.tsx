"use client"

import MainDashboard from "@/components/MainDashboard";
import SideBar from "@/components/SideBar";
import { useAuth , useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";


export default function (){

    const { userId } = useAuth() // TODO : redirect to sign up 

    const { user } = useUser()

    useEffect(() => {console.log(userId)} , [userId])

    if( !user || !userId || !user.imageUrl || !user.username ){ // TODO : Not Authorized page
        return (
            <div>
                <h1>
                    Not Authorized
                </h1>
            </div>
        )
    } 


    return(
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#171717]">
            <SideBar username={user.username} imageUrl={user.imageUrl} userId={userId} />
            <MainDashboard userId={userId} username={user.username}/>
        </div>
    )

}