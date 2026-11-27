import ContentDashboard from "@/components/ContentDashboard"
import SideBar from "@/components/SideBar"
import { auth, currentUser } from "@clerk/nextjs/server"

export default async function ContentsPage({params} : {params : Promise<{ collectionsId : string }>}) {

    const { collectionsId } = await params;
    
   
    const [authData, user] = await Promise.all([
        auth(),
        currentUser()
    ]);
    
    const { userId } = authData;

    
    if (!user || !userId || !user.imageUrl || !user.username) {
        return (
            <div>
                <h1>Not Authorized</h1>
            </div>
        );
    }  

    return (
            <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#171717]">
                <SideBar username={user.username} imageUrl={user.imageUrl} userId={userId} type="content"/>
                <ContentDashboard collectionsID={collectionsId} userID={userId}/>            
            </div>
    )
}