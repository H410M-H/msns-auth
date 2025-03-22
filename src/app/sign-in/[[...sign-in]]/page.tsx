"use client"

import { SignIn } from "@clerk/nextjs"
import Image from "next/image"
import { redirect } from "next/navigation";

export default function LoginPage() {
  const role = 'admin' || 'clerk' || 'principal' || 'teacher' || 'student';
  if (!role) {
    redirect("/")
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[url('https://res.cloudinary.com/dvvbxrs55/image/upload/v1729267627/FrontView1_alaabu.jpg')] bg-cover bg-center px-4 sm:px-6 lg:px-4 py-2 animate-fade-in">
      <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-800 shadow-xl transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-80 transition duration-700 ease-in-out hover:rotate-0 hover:skew-y-0 hover:scale-105"></div>
        <div className="relative bg-white/60 backdrop-blur-lg shadow-lg rounded-3xl sm:p-10 animate-fade-in-up">
          <div className="flex flex-col items-center">
            <Image
              src="https://res.cloudinary.com/dvvbxrs55/image/upload/v1729267533/Official_LOGO_grn_ic9ldd.png"
              alt="logo"
              width={200}
              height={200}
              className="animate-bounce"
            />
            <h1 className="text-6xl font-serif font-semibold text-amber-700 mt-2 transition duration-300 transform hover:scale-105">
              MSNS-LMS
            </h1>
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-green-800 hover:bg-blue-800/90 text-primary-foreground",
                    card: "bg-transparent",
                    headerTitle: "hidden",
                    headerSubtitle: "text-emerald-800 ",
                    socialButtonsBlockButton:
                      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  },
                }}
                forceRedirectUrl={`/${role.toLowerCase()}`}
              />
          </div>
        </div>
      </div>
    </div>
  )
}

