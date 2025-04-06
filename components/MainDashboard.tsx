"use client"
import { BellIcon , ChevronDownIcon, Plus, Square, SquareCheckBig, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Sort } from "../lib/types/types"
import { ContentType } from "@prisma/client";
import axios from "axios"
import CreateCollectionModel from "./CreateCollectionModel";
import { DataContext } from "@/providers/dashboardProvider";
import { Alert } from "./Alert";

interface RecCollectionData {
    id : string 
    title : string 
    description : string
    contents : [],
    contentType : ContentType[]
}


export default function MainDashboard( { username , userId } : { username : string , userId : string } ){

    const [sort , setSort] = useState<Sort>("Default")
    const [drop , setDrop] = useState(false)
    const [ creationModal , setCreatetionModal] = useState(false)
    const [ recData , setRecData ] = useState<RecCollectionData[]>([])

    const [ selectedCollection , setSelectedCollection] = useState<string[]>([])

    const alert = useContext(DataContext)

    const fetchCollections = async () => {
        try{
            const response = await axios.get(`http://localhost:3000/api/collections/${userId}`)
            console.log(response)
            if (response.data.data.length > 0) {
                console.log(response)
                setRecData( () => response.data.data ) 
            }

            return 
        }
        catch(e){
            console.log(e)
            alert?.addAlert("Unable to fetch the Collections")
        }
    }

    const deleteCollections = async (collectionId : string) => {
            if(selectedCollection.length === 0)return
            const response = await axios.delete(`http://localhost:3000/api/collections/${userId}` , {data : {id : collectionId , userId}})
            if(response.status === 200){
                setRecData(() => recData.filter( data => data.id !== response.data.data.id))
                setSelectedCollection(() => [])
            } else {
                return alert?.addAlert("Unable to Delete that Collection")
            }
    }

    useEffect( () => {
        fetchCollections()
    } , [])
    useEffect(() => {
        console.log(alert)
    } , [alert])

    if(!username){
        return
    }

    return (
        <>
            {alert && alert.alert.length > 0 ? <Alert/> : undefined }
                        
            {creationModal ? <CreateCollectionModel userId={userId} closeModal={() => setCreatetionModal(false)} addCreatedData={(response) => setRecData( () => [...recData , response.data.data])}/> : undefined}

            <div className="flex flex-col w-full bg-[#171717] pl-0">
                <div className="border-b border-[#292929] h-fit w-full px-8 py-6">
                    <div className="flex justify-between">
                        <div className="">
                            <h1 className="text-lg font-bold">
                                Welcome back, {username.toUpperCase()} 
                            </h1>
                            <p className="text-[#737373]">
                                Here is your collection 
                            </p>
                        </div>
                        <div>
                            <BellIcon className="size-11 p-2 bg-[#292929] hover:text-emerald-400 hover:bg-zinc-700 duration-300 rounded-lg"/>
                        </div>
                    </div>
                </div>
                <div className="py-7 px-8 flex flex-row justify-between">
                    <div className="flex gap-2 items-center">
                        <h1 className="text-md">
                            My Collections
                        </h1>
                        <button
                        onClick={() => setCreatetionModal(() => !creationModal)} 
                        className="p-2 rounded-lg bg-[#292929] flex gap-1 hover:bg-zinc-500/30 cursor-pointer">
                            Create
                            <Plus/>
                        </button>
                        <button
                        onClick={() => { selectedCollection.forEach((id) => {
                            deleteCollections(id)
                        }) }}
                        className={`p-2 rounded-lg flex gap-1 ${ selectedCollection.length > 0 ? "cursor-pointer bg-red-500/30 text-red-500" : "bg-[#292929] text-zinc-600 cursor-not-allowed" } `}>
                            Delete
                            <Trash2 />
                        </button>
                    </div>
                    <div className="md:flex hidden gap-3">
                        <h1 className="text-[#737373] text-md">
                            Sort By
                        </h1>
                        <div
                        onClick={() => {
                            setDrop(() => !drop)
                        }}
                        className="flex select-none cursor-pointer">
                            <h1>
                                {sort === "Default" ? "All Collections" : sort}
                            </h1>
                            <div className="z-10">
                                <ChevronDownIcon className={` ${ drop ? "rotate-180" : "" } `}/>
                                { drop ? <div className="fixed right-[28px] flex flex-col gap-4 border border-zinc-700 p-4 rounded-xl bg-[#171717]" >
                                    <div>
                                        <button
                                        onClick={() => {
                                            setSort(() => "Default")
                                        }} 
                                        className="p-2 hover:bg-[#171717] hover:text-white  hover:border-emerald-400 border rounded-xl text-center w-full text-black bg-emerald-400">
                                            All Collections
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                        onClick={() => {
                                            setSort(() => "WEBPAGE")
                                        }} 
                                        className="p-2 hover:bg-[#171717] hover:text-white border hover:border-emerald-400 rounded-xl text-center w-full  text-black bg-emerald-400">
                                            Web Page
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                        onClick={() => {
                                            setSort(() => "NOTE")
                                        }}
                                        className="p-2 hover:bg-[#171717] hover:text-white border hover:border-emerald-400 rounded-xl text-center w-full  text-black bg-emerald-400">
                                            Note
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                        onClick={() => {
                                            setSort(() => "CODE")
                                        }} 
                                        className="p-2 hover:bg-[#171717] hover:text-white border hover:border-emerald-400 rounded-xl text-center w-full  text-black bg-emerald-400">
                                            Code
                                        </button>
                                    </div>
                                    <div>
                                        <button 
                                        onClick={() => {
                                            setSort(() => "YOUTUBE")
                                        }}
                                        className="p-2 hover:bg-[#171717] hover:text-white border hover:border-emerald-400 rounded-xl text-center w-full  text-black bg-emerald-400">
                                            Youtube
                                        </button>
                                    </div>
                                    
                                </div> : null  }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 px-8 gap-10">
                    { recData.length > 0  ? recData.map( (data , index) => {
                        return <div key={index} className={`rounded-lg px-5 py-3 bg-[#292929] border border-[#292929] ${selectedCollection.includes(data.id) ? "border-emerald-400" : ""} drop-shadow-xl flex flex-col gap-3`}>
                        <div className="flex flex-col">
                            <div className=" flex justify-between items-center">
                                <a href={`/dashboard/${data.id}`} className="text-lg font-mono select-none hover:text-blue-400 hover:underline cursor-pointer">
                                    {data.title}
                                </a>
                                <div onClick={ () => {
                                    if(selectedCollection.includes(data.id)){
                                        setSelectedCollection(() => selectedCollection.filter(id => id !== data.id))
                                    }else{
                                        setSelectedCollection(() => [...selectedCollection , data.id])
                                    }
                                }}>
                                {selectedCollection.includes(data.id) ? <SquareCheckBig className="hover:bg-zinc-500/20 p-1 size-9 rounded-xl cursor-pointer text-emerald-400"/> : <Square                                    
                                    className="hover:bg-zinc-500/20 p-1 size-9 rounded-xl cursor-pointer" /> }
                                </div>
                            </div>
                            <p className="text-md text-[#737373] select-none line-clamp-2">
                                {data.description}  
                            </p>
                        </div>
                        <div>
                        <div
                        
                        className="gap-2 gap-y-3 overflow-clip flex flex-wrap">
                            {data.contentType.includes("WEBPAGE") ? <h1 className="border w-fit select-none px-3 py-1 rounded-full font-mono border-emerald-400 text-emerald-400 bg-emerald-400/10 drop-shadow-lg"> 
                                WEBPAGE
                            </h1> :undefined}
                                
                            {data.contentType.includes("YOUTUBE") ? <h1 className="border w-fit px-3 py-1 select-none rounded-full font-mono border-red-400 text-red-400 bg-red-400/10 drop-shadow-lg"> 
                                YOUTUBE
                            </h1> :undefined}
                            
                            {data.contentType.includes("NOTE") ?<h1 className="border w-fit px-3 py-1 select-none rounded-full font-mono border-purple-400 text-purple-400 bg-purple-400/10 drop-shadow-lg"> 
                                NOTE
                            </h1>:undefined}
                            
                            {data.contentType.includes("CODE") ?<h1 className="border w-fit px-3 py-1 select-none rounded-full font-mono border-blue-400 text-blue-400 bg-blue-400/10 drop-shadow-lg"> 
                                CODE
                            </h1>:undefined}
                        </div>
                        </div>
                            <h1 className="text-lg font-mono select-none">
                                Number of Contents : {data.contents.length} 
                            </h1>
                    </div>
                    }) : ""}  
                </div>
            </div>
        </>
    )
}
