'use client'

import { Button } from "../Button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Dialog";
import Social from "./Social";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useState } from "react";
import BackButton from "./BackButton";

type AuthDialogProps = {
  windowWidth: number;
}

const AuthDialog = ({ windowWidth }: AuthDialogProps) => {
  const [isLoginFormActive, setIsLoginFormActive] = useState<boolean>();

  const handleLoginFormClick = () => {
    setIsLoginFormActive(true);
  }

  const handleRegisterFormClick = () => {
    setIsLoginFormActive(false);
  }

  const handleBackButtonClick = () => {
    setIsLoginFormActive(!isLoginFormActive);
  }
 
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center gap-x-3 w-fit h-fit">
          {windowWidth > 768 && (
            <Button variant="link" size="link" onClick={handleLoginFormClick}>
              Sign in
            </Button>
          )}
          <Button variant="auth" size="wide" onClick={handleRegisterFormClick}>
            Get Started
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[380px] flex flex-col
         bg-[#F0E7DB] dark:bg-[#202023]">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="text-[2.3rem] font-Rounded1c">
            {isLoginFormActive ? "Sign In" : "Register"}
          </DialogTitle>
          <DialogDescription className="text-[#151515] dark:text-[#7b7b7b]">
            {isLoginFormActive ? "Welcome back" : "Create an account"}
          </DialogDescription>
        </DialogHeader>
        {isLoginFormActive ? <LoginForm /> : <RegisterForm />}
        <div className="flex items-center gap-y-5 flex-col mb-2">
          <Social />
          <BackButton 
            handleClick={handleBackButtonClick} 
            label={isLoginFormActive ? "Don't have an account?" : "Already have an account?"} 
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthDialog
