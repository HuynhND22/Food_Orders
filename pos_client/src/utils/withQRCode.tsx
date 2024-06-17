import React, { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";

const withQRCode = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithQRCode: React.FC<P> = (props) => {
    const router = useRouter();
    useEffect(() => {
      const table = getCookie("table");
      if (!table) {
        router.push("/errors"); // Replace '/error' with your actual error page URL
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return WithQRCode;
};

// Helper function to get cookie value by name
function getCookie(name: string) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export default withQRCode;
