"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function formatToDDMMYYYY(date: Date | undefined) {
    if (!date) return "";
    return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
}

function parseDDMMYYYY(input: string): Date | undefined {
    const parts = input.split("/");
    if (parts.length !== 3) return undefined;
    const [dd, mm, yyyy] = parts.map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    return isNaN(date.getTime()) ? undefined : date;
}

/**
 * FIXED: Bypasses .toISOString() timezone shift.
 * Extracts the exact local dates chosen by the user.
 */
function toLocalISOString(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

/**
 * FIXED: Safe construction of incoming "YYYY-MM-DD" values
 * to avoid midnight timezone shifting.
 */
function parseLocalISOString(isoString: string): Date | undefined {
    if (!isoString) return undefined;
    const parts = isoString.split("-");
    if (parts.length !== 3) return undefined;
    const [yyyy, mm, dd] = parts.map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    return isNaN(date.getTime()) ? undefined : date;
}

export function DatePicker({
    inputId,
    value,
    onChange,
    isInvalid,
    disabled
}: {
    inputId: string;
    value: string;
    onChange: (value: string) => void;
    isInvalid: boolean;
    disabled?: boolean;
}) {
    // FIXED: Use local string parser instead of constructor to avoid timezone drift
    const isoDate = React.useMemo(() => parseLocalISOString(value), [value]);
    const displayValue = isoDate ? formatToDDMMYYYY(isoDate) : "";

    const [open, setOpen] = React.useState(false);

    // Manage calendar dynamic position focusing safely
    const [month, setMonth] = React.useState<Date>(new Date());

    React.useEffect(() => {
        if (isoDate) {
            setMonth(isoDate);
        }
    }, [isoDate]);

    // Year range configuration
    const years = Array.from({ length: 130 }, (_, i) => 1900 + i);

    return (
        <div className="relative flex gap-2">
            <Input
                id={inputId}
                value={displayValue}
                placeholder="DD/MM/YYYY"
                disabled={disabled}
                className={cn(
                    "bg-background pr-10",
                    disabled && "cursor-not-allowed bg-muted opacity-60",
                    isInvalid && "border-red-500"
                )}
                autoComplete="off"
                onChange={(e) => {
                    if (disabled) return;

                    const inputValue = e.target.value;
                    const parsed = parseDDMMYYYY(inputValue);
                    if (parsed) {
                        onChange(toLocalISOString(parsed));
                        setMonth(parsed);
                    }
                }}
                onKeyDown={(e) => {
                    if (disabled) return;

                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setOpen(true);
                    }
                }}
            />

            <Popover
                open={disabled ? false : open}
                onOpenChange={(v) => !disabled && setOpen(v)}
            >
                <PopoverTrigger asChild>
                    <Button
                        id="date-picker"
                        variant="ghost"
                        disabled={disabled}
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-auto overflow-hidden p-0 bg-background text-foreground border shadow-md z-50"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    {/* YEAR SELECTOR */}
                    <div className="flex items-center justify-between px-3 py-2 border-b bg-muted">
                        <select
                            disabled={disabled}
                            className="bg-transparent text-sm"
                            value={month.getFullYear()}
                            onChange={(e) => {
                                const selectedYear = Number(e.target.value);
                                const newDate = new Date(selectedYear, month.getMonth(), 1);
                                setMonth(newDate);
                            }}
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>

                        <span className="font-semibold text-sm">
                            {month.toLocaleString("default", { month: "long" })}
                        </span>
                    </div>

                    <Calendar
                        mode="single"
                        selected={isoDate}
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(selectedDate) => {
                            if (disabled || !selectedDate) return;

                            // FIXED: Use updated local formatting handler
                            onChange(toLocalISOString(selectedDate));
                            setOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}