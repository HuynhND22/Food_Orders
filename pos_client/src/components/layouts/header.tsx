"use client";

export default function Header() {
  return (
    <header className="rounded-t-lg w-[100%] fixed top-1 p-2 z-10 bg-[#ffba00]">
      <div className=" w-[100%] flex justify-center ">
        <img
          src="/images/logo/logo-transparent.png"
          alt="logo order food"
          className="w-[50%] h-[50%]"
        />
      </div>
    </header>
  );
}
