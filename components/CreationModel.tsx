import { DataContext } from "@/providers/dashboardProvider"
import { ContentType } from "@prisma/client"
import axios, { AxiosResponse } from "axios"
import { useContext, useEffect, useState } from "react"

export default function CreationModel ({userId , closeModal , addCreatedData , type , collectionID} : {userId : string , closeModal : () => void , addCreatedData : (response : AxiosResponse) => void , type : "collection" | "content" , collectionID : string}) {

    const url = `${type === "content" ? `http://localhost:3000/api/${collectionID}/content/?userID=${userId}` : `http://localhost:3000/api/collections/${userId}`}`
    

    const alert = useContext(DataContext)
    const [contentType , setContentType] = useState<ContentType[]>([])

    const handleSubmit = async () => {
        if(collectionData.title === ""){
            alert?.addAlert("Title cannot be empty")
            return 
        } else if(contentType.length === 0){
            return alert?.addAlert("Please choose a Content Type")
        }
        try {

            const response = await axios.post(url , {
                title : collectionData.title,
                description : collectionData.description || "",
                contentType : contentType,
                mainContent : collectionData.mainContent,
                clerkId : userId,         
            })
            addCreatedData(response)
            return response
    }
        catch(e){
            alert?.addAlert("Something Went Wrong")
        }
    }    

    const [ collectionData , setCollectionData ] = useState<{
        title : string
        description ?: string
        mainContent ?: string
    }>({title : ""})

    return (
        
        <div className="fixed inset-0 h-full w-full backdrop-blur-lg bg-black/30 flex justify-center items-center z-50">
    <div className="flex flex-col gap-2 px-4 py-5 bg-zinc-800 rounded-xl w-[436px] shadow-xl">
        <div className="gap-2 flex flex-col ">
            <h1 className="text-xl font-mono font-bold">
                Title
            </h1>
            <input
            onChange={(e) => {
                setCollectionData(prev => ({...prev , title : e.target.value}))
            }} 
            type="text" className="border-2 border-zinc-500 text-xl py-1 px-2 rounded-xl focus:outline-none "/>
        </div>
        {type !== "content" ? undefined : <div className="gap-2 flex flex-col ">
            <h1 className="text-xl font-mono font-bold">
                Main Content
            </h1>
            <input
            onChange={(e) => {
                setCollectionData(prev => ({...prev , mainContent : e.target.value}))
            }} 
            type="text" className="border-2 border-zinc-500 text-xl py-1 px-2 rounded-xl focus:outline-none "/>
        </div> }
        <div className="flex flex-col gap-2 ">
            <h1 className="font-bold text-xl">
                Content Type
            </h1>
            <div 
            className="gap-2 gap-y-3 overflow-clip flex flex-wrap">
                <button 
                    onClick={(e) => {
                        if(contentType.length !== 0 && contentType.includes("WEBPAGE")){
                            setContentType( () => contentType.filter(contentType => contentType !== "WEBPAGE"))
                        } else{
                            setContentType( () => [...contentType , "WEBPAGE" ])
                        }
                        e.preventDefault()
                    }}
                    className={`border w-fit px-3 py-1.5 rounded-full font-mono border-emerald-400 text-emerald-400    ${contentType.includes("WEBPAGE") ? "bg-emerald-400/20" : ""} drop-shadow-lg`}> 
                        WEBPAGE
                </button>
                <button 
                    onClick={(e) => {
                        if(contentType.includes("YOUTUBE")){
                            setContentType( () => contentType.filter(contentType => contentType !== "YOUTUBE"))
                        } else{
                            setContentType( () => [...contentType , "YOUTUBE" ])
                        }
                        e.preventDefault()
                    }}
                    className={`border w-fit px-3 py-1.5 rounded-full font-mono border-red-400 text-red-400 ${contentType.includes("YOUTUBE") ? "bg-red-400/20" : ""} drop-shadow-lg`}> 
                        YOUTUBE
                </button>
                <button 
                    onClick={(e) => {
                        if(contentType.includes("NOTE")){
                            setContentType( () => contentType.filter(contentType => contentType !== "NOTE"))
                        } else{
                            setContentType( () => [...contentType , "NOTE" ])
                        }
                        e.preventDefault()
                    }}
                    className={`border w-fit px-3 py-1.5 rounded-full font-mono border-purple-400 text-purple-400 ${contentType.includes("NOTE") ? "bg-purple-400/20" : ""} drop-shadow-lg`}> 
                        NOTE
                </button>
                <button 
                    onClick={(e) => {
                        if(contentType.includes("CODE")){
                            setContentType( () => contentType.filter(contentType => contentType !== "CODE"))
                        } else{
                            setContentType( () => [...contentType , "CODE" ])
                        }
                        e.preventDefault()
                    }}
                    className={`border w-fit px-3 py-1.5 rounded-full font-mono border-blue-400 text-blue-400 ${contentType.includes("CODE") ? "bg-blue-400/20" : ""} hover:bg-blue-400/20 drop-shadow-lg`}> 
                        CODE
                </button>
            </div>
        </div>
        <div className="gap-2 flex flex-col ">
            <h1 className="text-xl font-mono font-bold">
                Description
            </h1>
           <textarea
           onChange={(e) => {
            setCollectionData(() => ({...collectionData , description : e.target.value}))
           }} 
           rows={5} className="border-2 border-zinc-500 text-xl py-1 px-2 rounded-xl focus:outline-none "></textarea>
        </div>
        <div className="flex justify-around py-2">
            <button 
            onClick={() => {
                closeModal()
                setContentType( () => [])
            }}
            className="border p-3 rounded-lg text-lg font-bold font-mono border-red-500 text-red-400 hover:bg-red-400/10">
                Cancel
            </button>
            <button 
            onClick={() => {
                handleSubmit()    
                setContentType( () => [])  
                closeModal()                  
            }}
            className="border p-3 rounded-lg text-lg font-bold font-mono border-emerald-500 text-emerald-500 hover:bg-emerald-500/10">
                Submit
            </button>
        </div>
    </div>
</div>
        
    )
}