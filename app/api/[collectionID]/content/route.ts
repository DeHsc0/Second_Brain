import { embeddingModel, model } from "@/lib/ai/geminiUtils";
import { prisma } from "@/lib/prisma/prisma";
import { aiResponse, ContentSchema } from "@/lib/types/types";
import { GenerativeModel } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client/extension";
import { NextRequest } from "next/server";


export async function POST(req : NextRequest , {params} : { params : { collectionID : string } }){

    try{

        const { collectionID } = await params

        const { searchParams } = new URL(req.url)

        const userID = searchParams.get("userID")
        
        const body = await req.json()
    
        const validData = ContentSchema.safeParse(body)

        if(!validData.success || !validData.data.contentType || !collectionID || !userID ){
            return new Response(JSON.stringify({
                message : "Invalid Input",
                data : validData
            }) , {status : 302})  
        }
        const prompt = `Analyze the following content and determine whether it's a WEBPAGE, YOUTUBE, CODE, INSTAGRAM, or NOTE. 
        Then provide a concise summary in approximately 100 words.

        """
        ${validData.data.mainContent}
        """

        Return only a JSON object with this structure:
        {
        "summary": "Your 100-word summary here"
        }`
        
       
        const insertData = async ( model : GenerativeModel , embeddingModel : GenerativeModel , prisma : PrismaClient , prompt : string) : Promise<any> => {

            const result = await model.generateContent(prompt);
            const summary = await result.response.text();

            const embedding = await embeddingModel.embedContent(summary)
            
            const id = crypto.randomUUID()

           
            const validResult = await result.response.text().replace(/```json\n|```\n/g, "")
                
            const parsedJson : aiResponse = JSON.parse(validResult)

            const response = await prisma.$executeRaw`
                  
                    INSERT INTO "Contents" (
                        "id",
                        "title", 
                        "description", 
                        "clerkId", 
                        "mainContent", 
                        "summary", 
                        "contentType", 
                        "collectionId", 
                        "embedding", 
                        "createdAt", 
                        "updateAt"
                    ) 
                    VALUES (
                        ${id},
                        ${validData.data.title}, 
                        ${validData.data.description}, 
                        ${userID}, 
                        ${validData.data.mainContent}, 
                        ${parsedJson.summary}, 
                        ${validData.data.contentType}::"ContentType", 
                        ${collectionID}, 
                        ${embedding.embedding.values}, 
                        NOW(), 
                        NOW()
                   )`;
                  const insertedContent = await prisma.$queryRaw`
                  SELECT "id", "title", "mainContent", "summary", "contentType" FROM "Contents"
                  WHERE "id" = ${id}`;
                  return insertedContent  
            };
        
        const data = await insertData(model , embeddingModel , prisma , prompt)
        return new Response(JSON.stringify({
            message : "Content Created Successfully",
            data
        }))
    }
    catch(e){
        return new Response(JSON.stringify({
            message : "Something went wrong",
            data : e
        }) , {status : 500})
    }
}

export async function GET(req: NextRequest , {params} : { params : { collectionID : string } } ) {
    
    try{
        const { collectionID } = await params

        const { searchParams } = new URL(req.url)

        const userID = searchParams.get("userID")

        if(!userID){
            return new Response(JSON.stringify({
                message : "Not Authorized" 
            }) , {status : 403})
        }

        console.log("USERID: " ,userID)
        console.log("Collection ID : " , collectionID)


        const data = await prisma.contents.findMany({
            where : {
                clerkId : userID,
                collectionId : collectionID
            },
            select : {
                title : true,
                summary : true,
                description : true,
                mainContent : true,
                contentType : true            
            }
        });
        
        return new Response(JSON.stringify({
        message: "Success",
        data: data
        }), {status: 200});
    }
    catch(e){
        return new Response(JSON.stringify({
            message : "Something went wrong",
            data : e
        }))
    }
  }

  export async function PUT( req : NextRequest ,  {params} : { params : { collectionID : string } }){

    try{

        const { collectionID } = params

        const { searchParams } = new URL(req.url)

        const userID = searchParams.get("userID")

        const body = await req.json()

        const validData = ContentSchema.safeParse(body)

        if(!validData.success || !validData.data.id || !userID){
            return new Response(JSON.stringify({
                message : "Invalid Input",
                data : validData.error
            }) , {status : 302})
        }

        const updateData: any = {};
        
        if (validData.data.title !== undefined) {
        updateData.title = validData.data.title;
        }

        if (validData.data.description !== undefined) {
            updateData.description = validData.data.description;
        }
        
        const response = await prisma.contents.update({
            where : {
                id : validData.data.id,
                clerkId : userID,
                collectionId : collectionID
            },
            data : updateData
        })    

        return new Response(JSON.stringify({
            message : "Content updated",
            data : response
        }) , {status : 200})
    }
    catch(e){
        return new Response(JSON.stringify({
            message : "Something went wrong",
            data : e
        }) , {status : 400})
    }
}

export async function DELETE( req : NextRequest ,  {params} : { params : { collectionID : string } } ){

    try{

        const { collectionID } = params

        const { searchParams } = new URL(req.url)

        const userID = searchParams.get("userID")


        const body = await req.json()

        const validData = ContentSchema.safeParse(body)

        if(!validData.success || !validData.data.id || !userID){
            return new Response(JSON.stringify({
                message : "Invalid Input",
                data : validData.error
            }) , {status : 302})
        }

        const response = await prisma.contents.delete({
            where : {
                id : validData.data.id,
                collectionId : collectionID,
                clerkId : userID
            }
        })    

        return new Response(JSON.stringify({
            message : "Content deleted",
            data : response
        }) , {status : 200})
    }
    catch(e){
        return new Response(JSON.stringify({
            message : "Something went wrong",
            data : e
        }) , {status : 400})
    }
}   