'use client'

import { useEffect, useState } from "react";

import { CoverImageDialog } from "../components/CoverImageDialog";

export const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, [])

  if(!isMounted){
    return null;
  }

  return (
    <>
      <CoverImageDialog />
    </>
  )
}
