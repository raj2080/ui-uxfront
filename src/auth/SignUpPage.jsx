import * as React from "react";
import { SignUpForm } from "./SignUpForm";

export function SignUpPage() {
  return (
    <div className="overflow-hidden bg-neutral-100">
      <div className="flex gap-5 max-md:flex-col">
        <div className="flex flex-col w-[39%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col mt-32 text-6xl font-bold text-red-400 max-md:mt-10 max-md:max-w-full max-md:text-4xl">
            <div className="mr-14 ml-10 max-md:mr-2.5 max-md:max-w-full max-md:text-4xl">
              Your POV matters.
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/fdcbfe77f2e46db4d6a964a03a72838ca1fb3530f67d82c5e29a2a8aae9b6d65?apiKey=4c138b1b1b484e5f913e9c1ba938948c&"
              alt="Decorative illustration"
              className="object-contain mt-24 w-full aspect-[1.42] max-md:mt-10 max-md:max-w-full"
            />
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[61%] max-md:ml-0 max-md:w-full">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}