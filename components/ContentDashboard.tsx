"use client"

import { RecCollectionData } from "@/lib/types/types"
import axios from "axios"
import { Loader, Search, X } from "lucide-react"
import React, { useEffect, useState } from "react"
import MainDashboard from "./MainDashboard"

export default function ContentDashboard ({collectionsID , userID} : {collectionsID : string , userID : string} ) {

    const [search , setSearch] = useState<string>() 
    const [searchResults , setSearchResults] = useState<RecCollectionData[]>()
    const [isLoading , setIsLoading] = useState<boolean>()

    const searchContents = async function (){
        if (!search || search.trim() === "") return;
        
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/${collectionsID}/search?userID=${userID}&query=${search}`)
            console.log(response)
            setSearchResults(() => response.data.data)
        } catch (error) {
            console.error("Error searching contents:", error)
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        if(search === ""){
            setSearchResults(() => undefined)
        }
    } , [search])

    const handleKeyDown =  (e : React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            searchContents()
        }    
    }

    return (
       <>
            <div className="flex flex-col w-full bg-[#171717] pl-0">
                    <div className="border-b border-[#292929] h-fit w-full px-8 py-6 ">
                        <div className="border-2 border-[#292929] px-5 py-4 w-full rounded-xl group focus:border-emerald-400">
                            <div className="flex gap-2 items-center">
                                {isLoading ? <Loader className="animate-spin text-emerald-400 rounded-lg p-2 size-9"/> : <Search onClick={() => searchContents} className="group-focus:bg-emerald-400/40 cursor-pointer hover:bg-emerald-400/20 hover:text-emerald-400 rounded-lg p-2 size-9"/>  }                      
                                <input 
                                disabled={isLoading}
                                onKeyDown={handleKeyDown} 
                                value={search || ""} 
                                onChange={(e) => setSearch(() => e.target.value)} 
                                type="text" 
                                className={`bg-[#292929]/50 w-full px-4 py-2 rounded-xl focus:outline-none text-md ${isLoading ? "text-zinc-400" : ""}`} placeholder="Describe and Press Enter or press that search button"/>
                                <X 
                                onClick={() => setSearch("")} 
                                className="text-red-500 p-2 rounded-lg size-9 bg-red-400/20 cursor-pointer"/>
                            </div>
                        </div>
                    </div>
                    <MainDashboard userId={userID} collectionID={collectionsID} type="content" username="Hello"   searchResuts={searchResults} search={search}/>
            </div>
       </>
    )

}