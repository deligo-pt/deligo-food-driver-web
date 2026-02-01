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
        <div className="flex items-center justify-between w-full lg:w-[70%] mx-auto rounded-lg bg-gray-100 h-13 px-5">
            {/* Logo Section */}
            <Link
                href="/"
                className="flex items-center gap-2 group transition-transform duration-300"
            >
                {/* Animated Logo Image */}
                <div className="w-9 h-9 overflow-hidden rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <Image
                        src="/deligoLogo.png"
                        alt="DeliGo Logo"
                        width={50}
                        height={50}
                        className="object-cover"
                        unoptimized
                    />
                </div>

                {/* Brand Text */}
                <span className="font-bold text-xl text-[#DC3173] group-hover:opacity-90 transition-opacity duration-300">
                    DeliGo
                </span>
            </Link>
            {/* Language */}
            <Select
                value={lang}
                onValueChange={(value: "en" | "pt") => setLang(value)}
            >
                <SelectTrigger className="w-17.5 hover:border-primary">
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
