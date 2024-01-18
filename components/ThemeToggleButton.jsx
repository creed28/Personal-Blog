'use client'

import Image from "next/image";
import { useState } from "react";

const ThemeToggleButton = () => {
  const [isToggle, setIsToggle] = useState(false);

  const toggleTheme = () => {
    setIsToggle(!isToggle);
  }

  return (
    <button 
      className={`flex items-center ${isToggle ? "bg-[#fbd38d] hover:bg-[#F6AD55]" 
      : "bg-[#805ad5] hover:bg-[#6B46C1]"} p-[10px] rounded-[0.375rem]`}
      onClick={toggleTheme}>
      <Image 
        src={`/assets/images/${isToggle ? "sun" : "moon"}-icon.png`}
        alt="Toggle dark theme"
        width={20}
        height={20} />
    </button>
  )
}

export default ThemeToggleButton
