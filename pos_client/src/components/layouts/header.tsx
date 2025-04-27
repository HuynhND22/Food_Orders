"use client";
import Image from 'next/image'

export default function Header() {
  return (
    <header className="rounded-t-lg w-[100%] fixed top-1 p-2 z-10 bg-[#ffba00]">
      <div className=" w-[100%] flex justify-center ">
        <Image
          src="/images/logo/logo-transparent.png"
          alt="logo order food"
          style={{ width: '50%', height: 'auto' }}
          width={200}
          height={40}
        />
      </div>
    </header>
  );
}
