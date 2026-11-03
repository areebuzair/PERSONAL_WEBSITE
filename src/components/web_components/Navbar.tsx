import Link from "next/link";

export default function Navbar() {
    return (
        <header className="w-full bg-slate-950">
            <nav className="container mx-auto flex gap-2 px-4 py-2 text-white">
                <Link href={"/"} className="mr-auto">Home</Link>
                
                <Link href={"/about"}>About</Link>
                <Link href={"/contact"}>Contact</Link>
            </nav>
        </header>
    )
}
