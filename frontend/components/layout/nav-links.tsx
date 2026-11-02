"user client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export type NavLink = {href: string, label: string; badge?: number};

const linkStyles = "px-2 py-1.5 text-sm";

function Badge({ count }: {count?: number}) {
    if (!count || count <= 0) return null;
    return (
        <span className="text-xs bg-red-500 text-white rounded-full px-1.5">
            {count}
        </span>
    );
}