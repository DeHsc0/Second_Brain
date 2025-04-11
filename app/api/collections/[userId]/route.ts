

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { CreationSchema, DeleteDataSchema} from "@/lib/types/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(req : NextRequest , { params }: { params: { userId: string } }){
    
    try {

        const {userId} = await params 

        if(!userId){
            return new Response(JSON.stringify({
                message : "Invalid Input"
            }) , {status : 400})
        }

        const response = await prisma.collections.findMany({
            where : {
                clerkId : userId
            },
            select : {
                contentType : true,
                contents : true,
                id : true,
                title : true,
                description : true,
            }
        })

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
        const body = await req.json()

        const validData = CreationSchema.safeParse(body)


        if(!validData.success ){  
            return new Response(JSON.stringify({
                message : "Invalid input",
                data : validData
            }) , {status : 400})
        }


        const collections = await prisma.collections.create({
            data : {
                title : validData.data.title,
                description : validData.data.description || "",
                clerkId : validData.data.clerkId, 
                contentType : validData.data.contentType
            },
            select : {
                contentType : true,
                contents : true,
                id : true,
                title : true,
                description : true,
            }
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

export async function DELETE(req : NextRequest , { params }: { params: { userId: string } }){

    try {

        const {userId} = await params

        const body = await req.json()

        const validData = DeleteDataSchema.safeParse(body)

        if(!validData.success || !Array.isArray(validData.data.ids)){
            return new Response(JSON.stringify({
                message : "Invalid Input",
                data : validData
            }) , {status : 400})
        }

        const response = await prisma.collections.deleteMany({
            where : {
                id : { in : validData.data.ids},
                clerkId : userId,
            }
        })

        return new Response(JSON.stringify({
            message : "Deleted Successfully",
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