import clsx from "clsx"
import { useState, type ReactNode } from "react"
import type { IconType } from "react-icons"
import { PiMinus, PiPlus } from "react-icons/pi"

type ContainerProps = {
    title?: string,
    Icon?: IconType,
    children?: ReactNode,
    collapsible?: boolean,
}

const Container = ({ title, Icon, children, collapsible = true }: ContainerProps) => {
    const [open, setOpen] = useState<boolean>(true);

    return (
        <div className="bg-neutral-800 rounded-b mb-5 w-full">
            <div
                className={clsx(`bg-amber-400 text-black flex gap-1 px-1 items-center text-sm uppercase
                        ${open ? "rounded-t" : "rounded"}`)}
                onClick={() => collapsible && setOpen(prev => !prev)}
            >
                {Icon && <Icon />}
                <span className="flex-1">{title}</span>
                {collapsible && (open ? <PiMinus /> : <PiPlus />)}
            </div>
            {open && <div className="p-5">
                {children}
            </div>}
        </div>
    )
}

export default Container;