import { useEffect, useMemo, useRef, useState } from "react";
import {
    useCameraStore,
    ORBIT_CAMERA,
    PLAYER_CAMERA,
} from "./store/cameraStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import {
    Check,
    ChevronDown,
    ChevronRight,
    ContactRound,
    Search,
} from "lucide-react";
import { useSeatStore } from "./store/seatStore";
import { CommandList } from "cmdk";
import { useControls } from "leva";

export default function Interface() {
    const setCurrentCamera = useCameraStore((state) => state.setCurrentCamera);
    const currentCamera = useCameraStore((state) => state.currentCamera);
    const seats = useSeatStore((state) => state.seats);

    const [,,get] = useControls(() => ({
        enableShots: {
            value: true,
            onChange: (v) => {
                if (v === false) document.isFocusOnSeat = false;
            }
        }
    }))

    const pop = useRef();

    // TODO: 点击后自动失焦，否则按下空格控制 Player 跳跃会再次触发按钮
    const handleSwitchView = (event) => {
        event.preventDefault();
        if (currentCamera === ORBIT_CAMERA) {
            setCurrentCamera(PLAYER_CAMERA);
        } else {
            setCurrentCamera(ORBIT_CAMERA);
        }
    };

    const [isFullScreen, setIsFullScreen] = useState(false);
    const handleSwitchFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullScreen(false);
        } else {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        }
    };

    const frameworks = [
        {
            value: "next.js",
            label: "Next.js",
        },
        {
            value: "sveltekit",
            label: "SvelteKit",
        },
        {
            value: "nuxt.js",
            label: "Nuxt.js",
        },
        {
            value: "remix",
            label: "Remix",
        },
        {
            value: "astro",
            label: "Astro",
        },
    ];

    const [open, setOpen] = React.useState(false);

    const setCurrentSeat = useSeatStore((state) => state.setCurrentSeat)
    const handleSelectSearchResult = (seat) => {
        setOpen(false);
        setCurrentSeat(seat);
        document.isFocusOnSeat = get('enableShots');
    }

    return (
        <>
            <div
                style={{
                    zIndex: 1000,
                    position: "absolute",
                    top: "20px",
                    left: "50%",
                    transform: "translate(-50%, 0)",
                    display: "flex",
                    gap: "5px",
                }}
            >
                <Command className="rounded-lg border shadow-md w-96">
                    <CommandInput
                        placeholder="💖Search💖"
                        onFocus={() => setOpen(true)}
                        onChangeCapture={(e) => {
                            if (e.target.value === "") {
                                setOpen(false);
                            } else {
                                setOpen(true);
                            }
                        }}
                    />
                    <CommandList 
                    style={{ display: open ? "block" : "none" }}
                        className="h-80 overflow-y-auto"
                    >
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Work stations">
                            {seats.map((seat, index) => (
                                <CommandItem
                                    key={index}
                                    value={seat.name}
                                    onSelect={() => handleSelectSearchResult(seat)}
                                >
                                    <ContactRound />
                                    <span className="pl-2">{seat.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>

            <div
                style={{
                    zIndex: 1000,
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    display: "flex",
                    gap: "10px",
                }}
            >
                <Button onClick={handleSwitchView}>Switch view</Button>
                <Button onClick={handleSwitchFullScreen}>
                    {isFullScreen ? "Exit full screen" : "Enter full screen"}
                </Button>
            </div>
        </>
    );
}
