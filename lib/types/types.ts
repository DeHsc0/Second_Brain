
import z from "zod"

export const CollectionSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    clerkId: z.string().optional(),
    contentType : z.array(
        z.enum([
            "WEBPAGE", "YOUTUBE", "CODE", "NOTE"
        ])
    ).optional(),
    id : z.string().optional()
})

export const ContentSchema = z.object({
    id : z.string().optional(),
    title : z.string(),
    description : z.string().optional(),
    mainContent : z.string(),
    contentType : 
        z.enum([
            "WEBPAGE", "YOUTUBE", "CODE", "NOTE"
        ])
    .optional(),
})

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
    changeSort : (sort : Sort) => void    // selected id's , 
} 
