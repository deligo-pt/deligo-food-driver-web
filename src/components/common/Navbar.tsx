'use client';

import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useStore } from "@/store/store";
import Image from "next/image";

const Navbar = () => {
    const { lang, setLang } = useStore();

    return (
        <div className="flex items-center justify-between w-[95%] md:w-[90%] lg:w-full mx-auto h-13 md:px-5 mt-2">
            {/* Logo Section */}
            <Link
                href="/"
                className="flex items-center gap-1 group transition-transform duration-300 p-1"
            >
                {/* Animated Logo Image */}
                <div className="relative w-7 h-7 overflow-hidden rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-primary/60 shadow-md">
                    <Image
                        src="/deligoLogo.png"
                        alt="DeliGo Logo"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>

                {/* Brand Text */}
                <span className="font-bold text-xl text-primary group-hover:opacity-90 transition-opacity duration-300">
                    DeliGo
                </span>
            </Link>
            {/* Language */}
            <Select
                value={lang}
                onValueChange={(value: "en" | "pt") => setLang(value)}
            >
                <SelectTrigger className="w-17.5 hover:border-primary focus:ring-primary font-semibold">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>

                {/* 👇 KEY FIX */}
                <SelectContent
                    position="popper"
                    sideOffset={4}
                    className="z-50 bg-white min-w-17.5"
                >
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="pt">PT</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default Navbar;
