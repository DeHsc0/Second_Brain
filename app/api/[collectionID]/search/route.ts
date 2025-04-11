import { embeddingModel } from "@/lib/ai/geminiUtils";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/prisma";


export async function GET( req : NextRequest ,{params} : { params : { collectionID : string } }){

    try {
        const {collectionID} = await params

        const { searchParams } = new URL(req.url)

        const userID = searchParams.get("userID")

        const query = searchParams.get("query")

        if(!query || !userID || !collectionID){
            return new Response(JSON.stringify({
                message: "Missing Params",
                data : {query , userID , collectionID}   // For debug purposes 
            }) , {status : 400})
        }

        const validQuery = query?.replace("+" , " ")


        const queryEmbedding = await embeddingModel.embedContent(validQuery)
        const embeddingValues = queryEmbedding.embedding.values;

        const searchResults = await prisma.$queryRaw`
          SELECT 
            "id", 
            "title", 
            "summary", 
            "contentType",
            "mainContent",
            1 - ("embedding" <-> ${embeddingValues}::vector) as similarity
          FROM "Contents"
          WHERE 
            "collectionId" = ${collectionID} AND
            "clerkId" = ${userID}
          ORDER BY similarity DESC
          LIMIT 5
        `;
        
        return new Response(JSON.stringify({
        message: "Search completed successfully",
        data: searchResults
        }) , {status : 200});
    } 
    catch(e){
        return new Response(JSON.stringify({
            message : "Something went wrong",
            data : e
        }) , {status : 500})
    }

}