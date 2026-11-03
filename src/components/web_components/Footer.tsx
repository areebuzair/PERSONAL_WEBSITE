import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-slate-950">
            <div className="container mx-auto grid grid-cols-3 gap-2 px-4 py-2 text-white">
                <Link href={"/"}>Home</Link>

                <Link href={"/about"}>About</Link>
                <Link href={"/contact"}>Contact</Link>
            </div>
        </footer>
    )
}
