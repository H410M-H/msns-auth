"use client"

import Link from "next/link"
import { Button } from "../ui/button"
export const LoginForm = () => {
    return(
        <form className="space-y-6 mt-8">
        <div className="relative">
          <input
            autoComplete="off"
            id="email"
            name="email"
            type="text"
            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600 bg-transparent transition duration-200 ease-in-out"
            placeholder="Email Address"
          />
          <label
            htmlFor="email"
            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
          >
            Email Address
          </label>
        </div>
        <div className="relative">
          <input
            autoComplete="off"
            id="password"
            name="password"
            type="password"
            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600 bg-transparent transition duration-200 ease-in-out"
            placeholder="Password"
          />
          <label
            htmlFor="password"
            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
          >
            Password
          </label>
        </div>
        <div className="flex justify-center mt-6">
        <Link href="/dashboard">
          <Button className="bg-green-500 w-full py-3 rounded-lg text-white text-lg hover:bg-green-600 transition duration-300 transform hover:scale-105">
            Login
          </Button>
          </Link>
        </div>
      </form>
    )
}