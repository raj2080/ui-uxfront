import * as React from "react";
import { InputField } from "./InputField";
import { GoogleButton } from "./GoogleButton";

export function SignUpForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const inputs = [
    { label: "Nickname", id: "nickname" },
    { label: "Email", id: "email", type: "email" },
    { label: "Password", id: "password", type: "password" },
    { label: "Re-type password", id: "repassword", type: "password" }
  ];

  return (
    <form onSubmit={handleSubmit} className="flex overflow-hidden flex-col px-20 py-44 mx-auto w-full text-base font-medium bg-white rounded-[40px_0px_0px_40px] max-md:px-5 max-md:py-24 max-md:max-w-full">
      <h1 className="self-start text-4xl font-bold text-zinc-800">
        Create an Account
      </h1>
      
      {inputs.map((input, index) => (
        <InputField
          key={input.id}
          label={input.label}
          type={input.type}
          id={input.id}
        />
      ))}

      <button className="self-stretch px-10 py-2.5 mt-14 text-2xl font-bold text-white bg-green-500 rounded-lg min-h-[45px] max-md:px-5 max-md:mt-10">
        Sign Up
      </button>

      <div className="flex mt-10 max-w-full w-[272px] max-md:ml-2.5">
        <span className="gap-2 self-stretch px-2 bg-white text-neutral-400">
          Already have an account?{" "}
        </span>
        <a href="#" className="gap-2 self-stretch px-2 text-blue-600 whitespace-nowrap bg-white">
          Login
        </a>
      </div>

      <div className="gap-2 self-center px-2 mt-1.5 whitespace-nowrap bg-white text-neutral-400">
        or
      </div>

      <GoogleButton />
    </form>
  );
}