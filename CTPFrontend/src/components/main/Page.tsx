import type { ReactNode } from "react"

type PageProps = {
    children?: ReactNode;
}

const Page = ({ children }: PageProps) => {
    return (
        <div className="page p-4">
            {children}
        </div>
    )
}

export default Page;