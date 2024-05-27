"use client";

import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import Link from "next/link";
import { BiHome } from "react-icons/bi";
import { BsList, BsPerson } from "react-icons/bs";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

export default function Nav() {
  const pathName = usePathname();

  const [value, setValue] = React.useState(() => {
    if (pathName == "/") {
      return 0;
    } else if (pathName == "/categories") {
      return 1;
    } else if (pathName == "/orders") {
      return 2;
    }
  });

  return (
    <Box className="fixed w-auto right-0 left-0 bottom-0 transition-transform">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(a, newValue: any) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label={"Home"}
          icon={<BiHome />}
          LinkComponent={Link}
          href="/"
        />
        <BottomNavigationAction
          label={"Danh mục"}
          icon={<BsList />}
          LinkComponent={Link}
          href="/categories"
        />
        <BottomNavigationAction
          label={"Đơn hàng"}
          icon={<BsPerson />}
          LinkComponent={Link}
          href="/orders"
        />
      </BottomNavigation>
    </Box>
  );
}
