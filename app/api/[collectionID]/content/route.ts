import { genAI } from "@/lib/ai/geminiUtils";
import { db } from "@/lib/prisma/prisma";
import { aiResponse, CreationSchema , UpdateContentSchema , DeleteDataSchema , ExclusiveParams} from "@/lib/types/types";
import { extractAdditionalContent} from "@/lib/Utils/utils";
import { NextRequest } from "next/server";

export async function POST(req : NextRequest , params : ExclusiveParams){

    try{

        const { collectionID } = await params.params

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
        
        let additionalContent: string | null;
        try {
            additionalContent = await extractAdditionalContent(validData.data.contentType, validData.data.mainContent)
        } catch (error) {
            console.error("Failed to retrieve additional content:", error)
            const message = validData.data.contentType.includes("YOUTUBE")
                ? "Unable to retrieve a transcript for this YouTube video. Check that the video is accessible and has captions."
                : "Unable to fetch this webpage. Check the URL and try again."

            return new Response(JSON.stringify({ message }), { status: 502 })
        }
        
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
            
        const insertData = async ( prompt : string) : Promise<unknown> => {      
            
            const result = await genAI.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt
            });
            
            const summary = result.text;

            if (!summary ) return new Response(JSON.stringify({ message : "Unable to Respond at this point of time try again later" , success : false }))
            
            const embedding = await genAI.models.embedContent({contents : summary , model : "gemini-embedding-2" , config : { outputDimensionality : 1536}})

            if (!embedding || !embedding.embeddings || !embedding.embeddings[0].values) return new Response(JSON.stringify({ message : "Unable to Respond at this point of time try again later" , success : false }))
            
            const id = crypto.randomUUID()
        
            const validResult = summary.replace(/```(json)?\n|```/g, "").trim()         
        
            const parsedJson : aiResponse = JSON.parse(validResult) 
        
            const contentTypeArray = `{${validData.data.contentType.join(',')}}`;

            const res = await db.query(db.raw.sql`     
            
            INSERT INTO "Contents" (
                "id", "title", "description", "clerkId", "mainContent", 
                "summary", "contentType", "collectionId", "embedding", 
                "createdAt", "updateAt"
            ) 
            VALUES (
            
                ${id}, ${validData.data.title}, ${validData.data.description || ""}, 
                ${userID}, ${validData.data.mainContent || ""}, ${parsedJson.summary}, 
                ${contentTypeArray}::"ContentType"[], ${collectionID}, 
                [${embedding.embeddings[0].values.join(",")}]::vector, NOW(), NOW()
            
            )`.returnsRow({ 
            
                id : db.sql.public.Contents.columns.id,
                title : db.sql.public.Contents.columns.title,
                mainContent : db.sql.public.Contents.columns.mainContent,
                summary : db.sql.public.Contents.columns.summary, 
                contentType : db.sql.public.Contents.columns.contentType
            
            }).build())

            return res
        };
        
        const data = await insertData(prompt)
        return new Response(JSON.stringify({
            message : "Content Created Successfully",
            data
        }) , {status : 200})
    }
    catch(e){
        console.error("Failed to create content:", e)
        return new Response(JSON.stringify({
            message : "Unable to create content. Please try again."
        }) , {status : 500})
    }
}

export async function GET(req: NextRequest , params : ExclusiveParams) {
    
    try{
        const { collectionID } = await params.params

        const { searchParams } = new URL(req.url)

        const userID = searchParams.get("userID")

        if(!userID){
            return new Response(JSON.stringify({
                message : "Not Authorized" 
            }) , {status : 401})
        }

        const data = await db.orm.public.Contents.where({

            clerkId : userID, 
            collectionId : collectionID

        }).select("id" , "title" , "summary" , "description" , "mainContent" , "contentType").all()

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

  export async function PUT( req : NextRequest , params : ExclusiveParams){

    try{

        const { collectionID } = await params.params

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

        const response = await db.orm.public.Contents.where({

            id : validData.data.id,
            clerkId : userID,
            collectionId : collectionID
            
        }).update(updateData)

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

export async function DELETE( req : NextRequest ,  params : ExclusiveParams ){

    try{

        const { collectionID } = await params.params

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

        const response = await db.orm.public.Contents.where((col) => col.id.in(validData.data.ids)).where({collectionId : collectionID , clerkId : userID }).deleteAndCount()

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
