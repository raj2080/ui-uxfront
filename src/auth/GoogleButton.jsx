import * as React from "react";

export function GoogleButton() {
  return (
    <div className="flex flex-col justify-center self-center p-2.5 mt-6 max-w-full text-sm text-zinc-800 w-[324px]">
      <button className="flex gap-2.5 justify-center items-center px-2.5 py-2.5 w-full rounded-lg border border-solid border-neutral-400 min-h-[45px]">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/837c49b66cd394d27d1d6f26b534f7c07741b3685f5ee75350c02400418786ba?apiKey=4c138b1b1b484e5f913e9c1ba938948c&"
          alt=""
          className="object-contain shrink-0 self-stretch my-auto aspect-[1.32] w-[37px]"
        />
        <span className="self-stretch my-auto">Continue with Google</span>
      </button>
    </div>
  );
}