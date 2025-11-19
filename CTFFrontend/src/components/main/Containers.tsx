import type { ReactNode } from "react"
import type { IconType } from "react-icons"

type ContainerProps = {
    title?: string,
    Icon?: IconType,
    children?: ReactNode[]
}

const Container = ({ title, Icon, children }: ContainerProps) => {
    return (
        <div className="bg-neutral-800 rounded-b mb-5 w-full">
            <div className="bg-amber-400 text-black flex gap-1 px-2 items-center rounded-t text-sm uppercase">
                {Icon && <Icon />}
                <span>{title}</span>
            </div>
            <div className="p-5">
                {children}
            </div>
        </div>
    )
}

export default Container;