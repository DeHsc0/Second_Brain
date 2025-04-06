import { DataContext } from "@/providers/dashboardProvider"
import { ContentType } from "@prisma/client"
import axios, { AxiosResponse } from "axios"
import { useContext, useEffect, useState } from "react"

export default function CreateCollectionModel ({userId , closeModal , addCreatedData} : {userId : string , closeModal : () => void , addCreatedData : (response : AxiosResponse) => void}) {

    
    const alert = useContext(DataContext)
    const [type , setType] = useState<ContentType[]>([])
    
    useEffect(() => {console.log("Type: " , type)} , [type])

    const handleSubmit = async () => {
        if(collectionData.title === ""){
            alert?.addAlert("Title cannot be empty")
            console.log("After update:", alert)
            return 
        } else if(type.length === 0){
            return alert?.addAlert("Please choose a Content Type")
        }
        try {
                            
        const response = await axios.post(`http://localhost:3000/api/collections/${userId}` , {
            title : collectionData.title,
            description : collectionData.description || " ",
            contentType : type,
            clerkId : userId,         
        })
        console.log(response)
        addCreatedData(response)
        return response
    }
        catch(e){
            alert?.addAlert("Something Went Wrong")
        }
    }    

    const toggleContentType = (contentType: ContentType) => {
        setType(prev => 
            prev.includes(contentType) 
                ? prev.filter(t => t !== contentType) 
                : [...prev, contentType]
        )
    }

    const [ collectionData , setCollectionData ] = useState<{
        title : string
        description ?: string
    }>({title : ""})
    return (
        
        <div className="fixed h-full w-full  backdrop-blur-xl flex justify-center items-center z-20 ">
                <div className="flex flex-col gap-2 px-4 py-5 bg-zinc-800 rounded-xl w-[436px]">
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
                    <div className="flex flex-col gap-2 ">
                        <h1 className="font-bold text-xl">
                            Content Type
                        </h1>
                        <div 
                        className="gap-2 gap-y-3 overflow-clip flex flex-wrap">
                            <button 
                                onClick={(e) => {
                                    if(type.length !== 0 && type.includes("WEBPAGE")){
                                        setType( () => type.filter(type => type !== "WEBPAGE"))
                                    } else{
                                        setType( () => [...type , "WEBPAGE" ])
                                    }
                                    e.preventDefault()
                                }}
                                className={`border w-fit px-3 py-1.5 rounded-full font-mono border-emerald-400 text-emerald-400    ${type.includes("WEBPAGE") ? "bg-emerald-400/20" : ""} drop-shadow-lg`}> 
                                    WEBPAGE
                            </button>
                            <button 
                                onClick={(e) => {
                                    if(type.includes("YOUTUBE")){
                                        setType( () => type.filter(type => type !== "YOUTUBE"))
                                    } else{
                                        setType( () => [...type , "YOUTUBE" ])
                                    }
                                    e.preventDefault()
                                }}
                                className={`border w-fit px-3 py-1.5 rounded-full font-mono border-red-400 text-red-400 ${type.includes("YOUTUBE") ? "bg-red-400/20" : ""} drop-shadow-lg`}> 
                                    YOUTUBE
                            </button>
                            <button 
                                onClick={(e) => {
                                    if(type.includes("NOTE")){
                                        setType( () => type.filter(type => type !== "NOTE"))
                                    } else{
                                        setType( () => [...type , "NOTE" ])
                                    }
                                    e.preventDefault()
                                }}
                                className={`border w-fit px-3 py-1.5 rounded-full font-mono border-purple-400 text-purple-400 ${type.includes("NOTE") ? "bg-purple-400/20" : ""} drop-shadow-lg`}> 
                                    NOTE
                            </button>
                            <button 
                                onClick={(e) => {
                                    if(type.includes("CODE")){
                                        setType( () => type.filter(type => type !== "CODE"))
                                    } else{
                                        setType( () => [...type , "CODE" ])
                                    }
                                    e.preventDefault()
                                }}
                                className={`border w-fit px-3 py-1.5 rounded-full font-mono border-blue-400 text-blue-400 ${type.includes("CODE") ? "bg-blue-400/20" : ""} hover:bg-blue-400/20 drop-shadow-lg`}> 
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
                            setType( () => [])
                        }}
                        className="border p-3 rounded-lg text-lg font-bold font-mono border-red-500 text-red-400 hover:bg-red-400/10">
                            Cancel
                        </button>
                        <button 
                        onClick={() => {
                            handleSubmit()    
                            setType( () => [])  
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