import MainDashboard from "@/components/MainDashboard"
import SideBar from "@/components/SideBar"
import { auth, currentUser } from "@clerk/nextjs/server"

export default async function ContentsPage({params} : {params : { collectionsId : string}}) {

    const {collectionsId} = params

    const {userId} = await auth() // TODO : redirect to sign up 
    
    const user = await currentUser()

    if( !user || !userId || !user.imageUrl || !user.username ){ // TODO : Not Authorized 
        return (
            <div>
                <h1>
                    Not Authorized
                </h1>
            </div>
        )

    }  

    console.log(collectionsId)

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#171717]">
            <SideBar username={user.username} imageUrl={user.imageUrl} userId={userId} />
        </div>
    )
}