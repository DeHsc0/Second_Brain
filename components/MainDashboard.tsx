"use client"
import { BellIcon , ChevronDownIcon, Plus, Square, SquareCheckBig, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { RecCollectionData, Sort } from "../lib/types/types"
import axios from "axios"
import CreationModel from "./CreationModel";
import { DataContext } from "@/providers/dashboardProvider";
import { Alert } from "./Alert";



export default function MainDashboard( { username , userId , type , collectionID , searchResuts} : { username : string , userId : string  , type : "collection" | "content" , collectionID : string  , searchResuts ?: RecCollectionData[]  , search ?: string }){

    const [sort , setSort] = useState<Sort>("Default")
    const [drop , setDrop] = useState(false)
    const [ creationModal , setCreatetionModal] = useState(false)
    const [ recData , setRecData ] = useState<RecCollectionData[]>([])

    const [ selectedData , setselectedData] = useState<string[]>([])

    const alert = useContext(DataContext)

    const fetchData = async () => {
        try{
            const response = await axios.get(`${type === "content" ? `http://localhost:3000/api/${collectionID}/content/?userID=${userId}` : `http://localhost:3000/api/collections/${userId}` }`)
            if (response.data.data.length > 0) {
                setRecData( () => response.data.data ) 
            }

            return 
        }
        catch(_e){
            alert?.addAlert(`Unable to fetch the ${type}`)
        }
    }

    const deleteData = async (collectionIds : string[]) => {
            if(selectedData.length === 0)return
            const response = await axios.delete(`${type === "content" ? `http://localhost:3000/api/${collectionID}/content/?userID=${userId}` :   `http://localhost:3000/api/collections/${userId}`}` , {
                data : {
                    ids : collectionIds
                }
            })

            if(response.status === 200 && selectedData.length === response.data.data.count){
                setRecData(prev => prev.filter(item => !selectedData.includes(item.id)))
                setselectedData(() => [])
            } else {
                return alert?.addAlert("Unable to Delete Selected Collections")
            }
    }

    useEffect( () => {
        fetchData()
    } , [])

    useEffect( () => {
        if(searchResuts && searchResuts.length > 0 ){
         setRecData(searchResuts)   
        } else{
            fetchData()
        }
    } , [searchResuts])

    if(!username){
        return
    }

    return (
        <>
            {alert && alert.alert.length > 0 ? <Alert/> : undefined }
                        
            {creationModal ? <CreationModel collectionID={collectionID} type={type} userId={userId} closeModal={() => setCreatetionModal(false)} addCreatedData={(response) => setRecData( () => [...recData , response.data.data[0]])}/> : undefined}

            <div className="flex flex-col w-full bg-[#171717] pl-0">
                {type === "collection" ? <div className="border-b border-[#292929] h-fit w-full px-8 py-6">
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
                </div> : undefined}
                <div className="py-7 px-8 flex flex-row justify-between items-center">
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
                        onClick={() => deleteData(selectedData)}
                        className={`p-2 rounded-lg flex gap-1 ${ selectedData.length > 0 ? "cursor-pointer bg-red-500/30 text-red-500" : "bg-[#292929] text-zinc-600 cursor-not-allowed" } `}>
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
                                {sort === "Default" ? `All ${type}` : sort}
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
                                            All {type}
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
                <div className={` grid ${ type === "collection" ? "lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1" : "lg:grid-cols-2 md:grid-cols-1 "}  px-8 gap-10`}>
                {recData.length > 0  ? recData.map( (data) => {
                        return <div key={recData.indexOf(data)} className={`rounded-lg px-5 py-3 bg-[#292929] border border-[#292929] ${selectedData.includes(data.id) ? "border-emerald-400" : ""} drop-shadow-xl flex flex-col gap-3`}>
                        <div className="flex flex-col">
                            <div className=" flex justify-between items-center">
                                <a href={type === "collection" ?`/dashboard/${data.id}` : undefined} className="text-lg font-mono select-none hover:text-blue-400 hover:underline cursor-pointer">
                                        {data.title}
                                    </a>
                                <div onClick={ () => {
                                    if(selectedData.includes(data.id)){
                                        setselectedData(() => selectedData.filter(id => id !== data.id))
                                    }else{
                                        setselectedData(() => [...selectedData , data.id])
                                    }
                                }}>
                                {selectedData.includes(data.id) ? <SquareCheckBig className="hover:bg-zinc-500/20 p-1 size-9 rounded-xl cursor-pointer text-emerald-400"/> : <Square                                    
                                    className="hover:bg-zinc-500/20 p-1 size-9 rounded-xl cursor-pointer" /> }
                                </div>
                            </div>
                            <p className="text-md text-white/40 select-none line-clamp-2">
                                {data.description}  
                            </p>
                        </div>
                        <div>
                            <div
                            className="gap-2 gap-y-3 overflow-clip flex flex-wrap">
                                { data.contentType && data.contentType.includes("WEBPAGE") ? <h1 className="border w-fit select-none px-3 py-1 rounded-full font-mono border-emerald-400 text-emerald-400 bg-emerald-400/10 drop-shadow-lg"> 
                                    WEBPAGE
                                </h1> :undefined}
                                    
                                { data.contentType &&  data.contentType.includes("YOUTUBE") ? <h1 className="border w-fit px-3 py-1 select-none rounded-full font-mono border-red-400 text-red-400 bg-red-400/10 drop-shadow-lg"> 
                                    YOUTUBE
                                </h1> :undefined}
                                
                                { data.contentType &&  data.contentType.includes("NOTE") ?<h1 className="border w-fit px-3 py-1 select-none rounded-full font-mono border-purple-400 text-purple-400 bg-purple-400/10 drop-shadow-lg"> 
                                    NOTE
                                </h1>:undefined}
                                
                                { data.contentType &&  data.contentType.includes("CODE") ?<h1 className="border w-fit px-3 py-1 select-none rounded-full font-mono border-blue-400 text-blue-400 bg-blue-400/10 drop-shadow-lg"> 
                                    CODE
                                </h1>:undefined}
                            </div>
                        </div>
                        {
                            type === "content" ? <div className="flex-col">
                                    <div className="flex-row">
                                        <h1 className="text-lg font-bold font-mono text-emerald-400">
                                            Main Content
                                        </h1>
                                        { data.contentType && (data.contentType.includes("WEBPAGE") || data.contentType.includes("YOUTUBE")) ? <a 
                                        className="hover:underline hover:text-emerald-400/60" href={data.mainContent}>{data.mainContent}</a> : <h1 className="font-mono overflow-hidden">
                                            {data.mainContent} 
                                        </h1>}
                                    </div>
                                    <div className="flex-row">
                                        <h1 className="text-lg font-bold font-mono text-emerald-400">
                                            Summary
                                        </h1>
                                        <h1 className="font-mono overflow-hidden ">
                                            {data.summary} 
                                        </h1>
                                    </div>
                            </div>
                         : undefined}
                           {type === "collection" ?  <h1 className="text-lg font-mono select-none">
                                Number of Contents : {data.contents && data.contents.length} 
                            </h1> : undefined}
                    </div>
                    }) : ""}
                </div>
            </div>
        </>
    )
}
