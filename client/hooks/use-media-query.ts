"use client"

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Set initial value on client-side
        if (typeof window !== "undefined") {
            const media = window.matchMedia(query);
            setMatches(media.matches);

            // Add listener
            const listener = () => setMatches(media.matches);
            media.addEventListener("change", listener);

            // Clean up
            return () => media.removeEventListener("change", listener);
        }

        return undefined;
    }, [query]);

    return matches;
}