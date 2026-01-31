'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useStore } from "@/store/store";

const Navbar = () => {
    const { lang, setLang } = useStore();

    return (
        <div className="flex items-center justify-end w-[90%] lg:w-[70%] mx-auto rounded-lg bg-gray-100 h-13 px-5">
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
