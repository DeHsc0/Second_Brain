// TODO : valid Status codes
// http://localhost:3000/api/collections?userId=59867c63-eaf5-4330-96e2-2e06eaf42097&id=373077e0-aa18-4eb0-8fdc-80467a6622c5

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { CollectionSchema } from "@/lib/types/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// POST : 
// GET : userId contentType 
// PUT : userId collection Id 
// DELETE : userId collection Id

export async function GET(req : NextRequest , { params }: { params: { userId: string } }){
    
    try {

        const {userId} = await params 

        if(!userId){
            return new Response(JSON.stringify({
                message : "Invalid Input"
            }) , {status : 302})
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
        }) , {status : 400})
    }
}

export async function POST(req : NextRequest){

    try{
        const body = await req.json()

        const validData = CollectionSchema.safeParse(body)


        if(!validData.success || !validData.data.contentType || !validData.data.description || !validData.data.title || !validData.data.clerkId){ // TODO remove the description it should be optional 
            console.log(validData)
            return new Response(JSON.stringify({
                message : "Invalid input",
                data : validData
            }) , {status : 302})
        }


        const collections = await prisma.collections.create({
            data : {
                title : validData.data.title,
                description : validData.data.description,
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

        console.log(collections)

        return new Response(JSON.stringify({
            message : "Collection Created Successfully",
            data : collections
        }) , {
            status : 200 
        })
    }


    catch(e){
        if(e instanceof PrismaClientKnownRequestError){
            return new Response(JSON.stringify({
                message : e 
            }))
        }
        else return new Response( JSON.stringify({
            message : e
        }))
    }
}

export async function DELETE(req : NextRequest , { params }: { params: { userId: string } }){

    try {

        const {userId} = await params

        const body = await req.json()

        const validData = CollectionSchema.safeParse(body)

        if(!validData.success || !validData.data.id){
            return new Response(JSON.stringify({
                message : "Invalid Input",
                data : validData
            }) , {status : 302})
        }

        const response = await prisma.collections.delete({
            where : {
                id : validData.data.id,
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
        }) , {status : 400})
    }
}