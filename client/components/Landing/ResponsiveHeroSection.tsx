"use client";

import { FC } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import DesktopHeroSection from "./Hero";
import MobileHeroSection from "./MobileHeroSection";




const ResponsiveHeroSection: FC = () => {
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    return isDesktop ? <DesktopHeroSection /> : <MobileHeroSection />;
};

export default ResponsiveHeroSection;