"use client"

import { Button } from "../ui/button"
export const SignupForm = () => {
    return(
<form className="space-y-6 mt-8">
<div className="relative">
  <input
    autoComplete="off"
    id="fullName"
    name="fullName"
    type="text"
    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-600 bg-transparent transition duration-200 ease-in-out"
    placeholder="Full Name"
  />
  <label
    htmlFor="fullName"
    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
  >
    Full Name
  </label>
</div>
<div className="relative">
  <input
    autoComplete="off"
    id="email"
    name="email"
    type="email"
    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-600 bg-transparent transition duration-200 ease-in-out"
    placeholder="Email address"
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
    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-600 bg-transparent transition duration-200 ease-in-out"
    placeholder="Password"
  />
  <label
    htmlFor="password"
    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
  >
    Password
  </label>
</div>
<div className="relative">
  <input
    autoComplete="off"
    id="confirmPassword"
    name="confirmPassword"
    type="password"
    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-600 bg-transparent transition duration-200 ease-in-out"
    placeholder="Confirm Password"
  />
  <label
    htmlFor="confirmPassword"
    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
  >
    Confirm Password
  </label>
</div>
<div className="flex justify-center mt-6">
  <Button className="bg-yellow-500 w-full py-3 rounded-lg text-white text-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105">
    Sign Up
  </Button>
</div>
</form>
    )
}