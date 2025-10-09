"use client"

import HeroSection from "@/components/HeroSection";
import NavBar from "../components/NavBar"
import WhatWeOffer from "@/components/WhatWeOffer";
import { useAuth } from "@clerk/nextjs";

export default  function Home() {

  const {isSignedIn , isLoaded} = useAuth()
    
    if (!isLoaded) {
        return undefined
    }


  return (
    <>
      <NavBar signedIn={isSignedIn}/>
      <HeroSection/>
      <WhatWeOffer/>
    </>
  );
}
