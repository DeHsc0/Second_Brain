"use client"
import { DataContext } from "@/providers/dashboardProvider"

import { useClerk } from "@clerk/nextjs"
import {ChevronsUpDown , Search , Folder, Star, History, Share , Brain, Github, LogOut} from "lucide-react"
import { Manrope } from 'next/font/google'
import { useContext } from "react"

const manrope = Manrope({
    subsets : ["latin"]
})

export default function SideBar( {userId , username , imageUrl , type } : {userId : string , imageUrl : string , username : string , type : "collection" | "content"} ){

    const sort = useContext(DataContext)
    const { openUserProfile , redirectToSignIn , signOut } = useClerk()

    if(!userId || !username || !sort){
        return
    }


    return (
        <div className={`${manrope.style} flex flex-col justify-start gap-6 py-7 px-4 md:px-2 lg:px-10 h-screen w-[280px] md:w-[300px] lg:w-[316px] bg-[#171717] border-r border-[#292929] fixed lg:static left-0 transform -translate-x-full lg:translate-x-0 transition-transform z-20`}>
            <div className="flex justify-between w-full items-center">
                <div className="flex gap-2">
                    { userId ? <img src={`${imageUrl}`} alt="" className="size-8 rounded-full" /> : ""}
                    <h1 className="text-2xl">
                        {username.toUpperCase()}
                    </h1>
                </div> 
                
                <div className="flex justify-between items-center gap-4">
                    <ChevronsUpDown onClick={() => openUserProfile()}  className="p-2 size-8 bg-[#292929] rounded-lg hover:bg-zinc-700"/>
                    <LogOut onClick={() => signOut() } className="p-2 size-8 bg-[#292929] rounded-lg hover:bg-zinc-700"/>
                </div>   
            </div>

            <div className=" flex justify-between flex-col h-full">
                <div className="space-y-8">
                    <div className="py-3 px-2 flex items-center justify-center group gap-2 bg-[#292929] rounded-lg">
                        <Search className="size-5 text-[#737373] group-focus-within:text-white duration-300"/>
                        <input type="text" className="text-md focus:outline-none overflow-visible" placeholder="Search" />
                    </div>
                    <div className=" flex flex-col gap-1">
                        <div
                        onClick={() => sort.changeSort("Default")} 
                        className={`p-3 gap-3 flex  w-full rounded-2xl cursor-pointer ${ sort.sortType === "Default" ? "bg-[#292929] duration-300" : ""}`}>
                            <Folder className={`size-6 ${sort.sortType === "Default" ? "text-emerald-400" : "text-[#737373] duration-300"} `} />
                            <h1 className="text-md">
                                My {type}
                            </h1>
                        </div>
                        <div
                        onClick={() => sort.changeSort("Favourite")} 
                        className={`p-3 gap-3 flex  w-full rounded-2xl cursor-pointer ${ sort.sortType === "Favourite" ? "bg-[#292929] duration-300" : ""}`}>
                            <Star className={`size-6 ${sort.sortType === "Favourite" ? "text-emerald-400" : "text-[#737373] duration-300"} `} />
                            <h1 className="text-md">
                                Favourite
                            </h1>
                        </div>
                        <div
                        onClick={() => sort.changeSort("Deleted")} 
                        className={`p-3 gap-3 flex  w-full rounded-2xl cursor-pointer ${ sort.sortType === "Deleted" ? "bg-[#292929] duration-300" : ""}`}>
                            <History className={`size-6 ${sort.sortType === "Deleted" ? "text-emerald-400" : "text-[#737373] duration-300"} `} />
                            <h1 className="text-md">
                                Deleted
                            </h1>
                        </div>
                        <div
                        onClick={() => sort.changeSort("Shared")} 
                        className={`p-3 gap-3 flex  w-full rounded-2xl cursor-pointer ${ sort.sortType === "Shared" ? "bg-[#292929] duration-300" : ""}`}>
                            <Share className={`size-6 ${sort.sortType === "Shared" ? "text-emerald-400" : "text-[#737373] duration-300"} `} />
                            <h1 className="text-md">
                                Shared
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="px-2 flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <Brain className="size-6"/>
                        <h1 className="text-xl">
                            Second Brain
                        </h1>
                    </div>
                    <div className="">
                        <Github className="size-11 p-2 bg-[#292929] hover:text-emerald-400 hover:bg-zinc-700 duration-300 rounded-lg"/>
                    </div>
                </div>

            </div>


        </div>
    )

}