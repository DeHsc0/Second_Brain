import { embeddingModel } from "@/lib/ai/geminiUtils";
import { NextRequest } from "next/server";
import { db } from "@/lib/prisma/prisma";


export async function GET( req : NextRequest ,{params} : { params : Promise<{ collectionID : string }> }){

    try {
        const {collectionID} = await params

        const { searchParams } = new URL(req.url)

        const userID = searchParams.get("userID")

        const query = searchParams.get("query")

        if(!query || !userID || !collectionID){
            return new Response(JSON.stringify({
                message: "Missing Params",
                data : {query , userID , collectionID}   
            }) , {status : 400})
        }

        const validQuery = query?.replace("+" , " ")

        const queryEmbedding = await embeddingModel.embedContent(validQuery)
        const embeddingValues = queryEmbedding.embedding.values;

        const searchResults = db.query(db.raw.sql`
            WITH query_vector AS (
                SELECT ${`[${embeddingValues.join(",")}]`}::vector AS value
            )
            SELECT
                c."id",
                c."title",
                c."summary",
                c."contentType",
                c."mainContent",
                (1 - (c."embedding" <=> q.value))::text AS "similarity"
            FROM "Contents" AS c
            CROSS JOIN query_vector AS q
            WHERE
                c."collectionId" = ${collectionID}
                AND c."clerkId" = ${userID}
            ORDER BY c."embedding" <=> q.value ASC
            LIMIT 5
            `.returnsRow({
            id: db.sql.public.Contents.columns.id,
            title: db.sql.public.Contents.columns.title,
            summary: db.sql.public.Contents.columns.summary,
            contentType: db.sql.public.Contents.columns.contentType,
            mainContent: db.sql.public.Contents.columns.mainContent,
            similarity: db.sql.public.Contents.columns.title,
        }).build())
        
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