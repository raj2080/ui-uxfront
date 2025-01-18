import * as React from "react";

export function InputField({ label, type = "text", id }) {
  return (
    <div className="flex flex-col items-start px-2 pb-9 mt-5 whitespace-nowrap bg-white rounded-lg border border-solid border-neutral-400 text-neutral-400 max-md:pr-5 max-md:max-w-full">
      <label htmlFor={id} className="sr-only">{label}</label>
      <input
        type={type}
        id={id}
        placeholder={label}
        className="gap-2 self-stretch px-2 bg-white w-full outline-none"
        aria-label={label}
      />
    </div>
  );
}