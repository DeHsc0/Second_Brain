
import { ContentType } from "@prisma/client"
import z from "zod"

export const CreationSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    clerkId: z.string(),
    mainContent: z.string().optional(),
    contentType : z.array(
        z.enum([
            "WEBPAGE", "YOUTUBE", "CODE", "NOTE"
        ])
    )
})

export const DeleteDataSchema = z.object({
    ids : z.array(z.string())
})


 export const UpdateContentSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
  });
  

export interface aiResponse {
    contentType : "CODE" | "NOTE" | "NONE",
    summary : string
}

export type Sort = "Default" | "WEBPAGE" | "NOTE" | "CODE" | "YOUTUBE" | "Favourite" | "Deleted" | "Shared"

export interface DashbordProvider {
    alert : string[],
    addAlert : (alert : string) => void,
    removeAlert : (alert : string) => void,
    sortType : Sort,
    changeSort : (sort : Sort) => void  
} 

export interface RecCollectionData {
    id : string 
    title : string
    description ?: string
    contents : []
    contentType : ContentType[]
    mainContent ?: string
    summary ?: string
    similarity ?: number
    
}

export interface ExclusiveParams {
    data : Promise<{collectionID : string}>
}
