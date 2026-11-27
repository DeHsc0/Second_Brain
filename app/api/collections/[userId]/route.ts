

import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/prisma/prisma";
import { CreationSchema, DeleteDataSchema} from "@/lib/types/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(req : NextRequest){
    
    try {

        const { isAuthenticated, userId } = await auth()

        if (!isAuthenticated) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
        }

        const response = await db.orm.public.Collections
        .where({ clerkId: userId })
        .select("id", "title", "description", "contentType")
        .include("contents")
        .all();

        return new Response(JSON.stringify({
            data : response
        }) , {status : 200})
    }
    catch(e){
        return new Response(JSON.stringify({
            message : "Someting went wrong",
            data : e
        }) , {status : 500})
    }
}

export async function POST(req : NextRequest){

    try{

        const { isAuthenticated, userId } = await auth()

        if (!isAuthenticated) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
        }

        const body = await req.json()

        const validData = CreationSchema.safeParse(body)

        if(!validData.success ){  
            return new Response(JSON.stringify({
                message : "Invalid input",
                data : validData
            }) , {status : 400})
        }

        const collections = await db.orm.public.Collections.select("id" , "title" , "description" , "contentType").create({
                title : validData.data.title,
                description : validData.data.description || "",
                clerkId : userId, 
                contentType : validData.data.contentType
            })

        return new Response(JSON.stringify({
            message : "Collection Created Successfully",
            data : [collections]
        }) , {
            status : 201
        })
    }


    catch(e){
        if(e instanceof PrismaClientKnownRequestError){
            return new Response(JSON.stringify({
                message : e 
            }) , {status : 500})
        }
        else return new Response( JSON.stringify({
            message : e
        }) , {status : 500})
    }
}

export async function DELETE(req : NextRequest){

    try {

        const { isAuthenticated, userId } = await auth()

        if (!isAuthenticated) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
        }

        const body = await req.json()

        const validData = DeleteDataSchema.safeParse(body)

        if(!validData.success || !Array.isArray(validData.data.ids)){
            return new Response(JSON.stringify({
                message : "Invalid Input",
                data : validData
            }) , {status : 400})
        }

        const response = await db.orm.public.Collections.where((col) => col.id.in(validData.data.ids)).where({ clerkId : userId}).deleteAll()

        return new Response(JSON.stringify({
            message : "Deleted Successfully",
            data : response.length
        }) , {status : 200})
    }
    catch(e){
        return new Response(JSON.stringify({
            message : "Something went wrong",
            data : e
        }) , {status : 500})
    }
}