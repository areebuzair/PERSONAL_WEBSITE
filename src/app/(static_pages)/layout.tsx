import Footer from "@/components/web_components/Footer";
import Navbar from "@/components/web_components/Navbar";

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <>
            <Navbar />
            <main className="container px-4 py-2 mx-auto">
                {children}
                </main>
            <Footer />
        </>
    );
}
