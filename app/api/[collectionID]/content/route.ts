import { embeddingModel, model } from "@/lib/ai/geminiUtils";
import { prisma } from "@/lib/prisma/prisma";
import { aiResponse, CreationSchema , UpdateContentSchema , DeleteDataSchema} from "@/lib/types/types";
import { extractAdditionalContent, extractTextFromUrl, getYouTubeTranscript } from "@/lib/Utils/utils";
import { GenerativeModel } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client/extension";
import { NextRequest } from "next/server";

export async function POST(req : NextRequest , {params} : { params : { collectionID : string } }){

    try{

        const { collectionID } = await params

        const { searchParams } = new URL(req.url)

        const userID = searchParams.get("userID")
        
        const body = await req.json()
    
        const validData = CreationSchema.safeParse(body)

        if(!validData.success || !collectionID || !validData.data.mainContent || !userID ){
            return new Response(JSON.stringify({
                message : "Invalid Input",
                data : validData
            }) , {status : 400})  
        }       
        
        const additionalContent : string | null = await extractAdditionalContent(validData.data.contentType , validData.data.mainContent)
        
        const prompt = `You are an expert content summarizer that creates concise 100-word summaries. Follow these rules:

        1. Take these inputs: {title}, {description}, {mainContent}, {contentType} , {additionalContent (which may only contain Transcript or web site Content if its a Youtube video or a url)} 
        2. Create a factual summary primarily based on mainContent but if there is additionalContent then please it the primary source of the summary 
        3. IMPORTANT: Analyze if the transcript or the webcontent have some relation with the title , description if there is one , if they dont have a relation DO NOT comment that the title and all dont have a relation , if they do have a relation then please include it in summary 
        4. IMPORTANT: Always include if there is some extra info about the mainContent or transcript in the title or description
        5. OUTPUT RULES:
        - Strictly use this format: {"summary":"Your 100-word summary here"}
        - No Markdown (\`\`\`json or \`\`\`)
        - No trailing text/comments/newlines outside the JSON object
        - Escape quotes in content (e.g., " -> \\")
        - Replace actual newlines with spaces
        6. Format: 
        {"summary":"Your 100-word summary here."}
        7. IMPORTANT NOTE : if the contentType dosen't contain YOUTUBE in it but the main Content seems to be a youtube link then please notify the user like "The main content Seems to be a Youtube video please delete this content and make a new one with correct content type"

        Inputs to summarize:
        Title: ${validData.data.title}
        Description: ${validData.data.description}
        Main Content : ${validData.data.mainContent}
        ${additionalContent ? `Additional Content: ${additionalContent}` : null}
        ContentType: ${validData.data.contentType}`
            
        const insertData = async ( model : GenerativeModel , embeddingModel : GenerativeModel , prisma : PrismaClient , prompt : string) : Promise<any> => {      
            
            const result = await model.generateContent(prompt);
                        
            const summary = await result.response.text();

            const embedding = await embeddingModel.embedContent(summary)
            
            const id = crypto.randomUUID()
        
            const validResult = await result.response.text().replace(/```(json)?\n|```/g, "").trim()         
        
            const parsedJson : aiResponse = JSON.parse(validResult) 
        
            const contentTypeArray = `{${validData.data.contentType.join(',')}}`;

            const response = await prisma.$executeRaw`     
            INSERT INTO "Contents" (
                "id", "title", "description", "clerkId", "mainContent", 
                "summary", "contentType", "collectionId", "embedding", 
                "createdAt", "updateAt"
            ) 
            VALUES (
                ${id}, ${validData.data.title}, ${validData.data.description}, 
                ${userID}, ${validData.data.mainContent}, ${parsedJson.summary}, 
                ${contentTypeArray}::"ContentType"[], ${collectionID}, 
                ${embedding.embedding.values}, NOW(), NOW()
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
        }) , {status : 200})
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
            }) , {status : 401})
        }

        const data = await prisma.contents.findMany({
            where : {
                clerkId : userID,
                collectionId : collectionID
            },
            select : {
                id : true,
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
        }) , {status : 500})
    }
  }

  export async function PUT( req : NextRequest ,  {params} : { params : { collectionID : string } }){

    try{

        const { collectionID } = params

        const { searchParams } = new URL(req.url)

        const userID = searchParams.get("userID")

        const body = await req.json()

        const validData = UpdateContentSchema.safeParse(body)

        if(!validData.success || !userID){
            return new Response(JSON.stringify({
                message : "Invalid Input",
                data : validData.error
            }) , {status : 400})
        }

        const updateData = {
            ...(validData.data.title !== undefined && { title: validData.data.title }),
            ...(validData.data.description !== undefined && { description: validData.data.description })
          };

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
        }) , {status : 500})
    }
}

export async function DELETE( req : NextRequest ,  {params} : { params : { collectionID : string } } ){

    try{

        const { collectionID } = params

        const { searchParams } = new URL(req.url)

        const userID = searchParams.get("userID")


        const body = await req.json()

        const validData = DeleteDataSchema.safeParse(body)

        if(!validData.success ||  !userID || !Array.isArray(validData.data.ids) ){
            return new Response(JSON.stringify({
                message : "Invalid Input",
                data : validData.error
            }) , {status : 400})
        }

        const response = await prisma.contents.deleteMany({
            where : {
                id : { in : validData.data.ids},
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
        }) , {status : 500})
    }
}   