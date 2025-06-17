
import { useState, useEffect } from "react";

export const useDeviceGtSm = (breakpoint = 640): boolean => {
  const [isGtSm, setIsGtSm] = useState(window.innerWidth > breakpoint);

  useEffect(() => {
    const handleResize = () => setIsGtSm(window.innerWidth > breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isGtSm;
};

export const useDesktopView = (breakpoint = 1024): boolean => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > breakpoint);
  
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  
  return isDesktop;
};
