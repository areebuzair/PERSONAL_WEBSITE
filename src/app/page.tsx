import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import { SiProtonmail } from "react-icons/si";
import { FaYoutube } from "react-icons/fa6";
import { FaFile } from "react-icons/fa6";

import Link from "next/link";
import styles from "@/styles/home.module.css"
import FluidBg from "@/components/landing_page/FluidBg";

export default function Home() {

  const navData = [
    {
      url: "https://areebuzair.github.io/",
      Icon: FaYoutube,
      title: "YouTube",
      color: "red"
    },
    {
      url: "https://github.com/areebuzair",
      Icon: FaGithub,
      title: "GitHub",
      color: "red"
    },
    {
      url: "mailto:jmareebuzair@proton.me",
      Icon: SiProtonmail,
      title: "Mail",
      color: "red"
    },
    {
      url: "https://www.linkedin.com/in/j-m-areeb-uzair-alam-017075389",
      Icon: FaLinkedin,
      title: "LinkedIn",
      color: "red"
    },
    {
      url: "https://areebuzair.github.io/cv-maker/cv.pdf",
      Icon: FaFile,
      title: "CV", 
      color: "red"
    }
  ]

  return (
    <>
      <FluidBg />
      <main className="max-w-full m-0 space-y-5">
        <section className={`w-full h-screen flex flex-col items-center justify-center text-center ${styles["hero-image"]}`}>
          <h1 className="font-mono font-bold text-[clamp(0.5rem,10vw,18rem)] leading-none text-center text-white">JMAREEBUZAIR</h1>
          <p className="text-gray-200">
            Full-stack developer based in Bangladesh.
          </p>
          <div className="flex flex-col justify-between gap-2 text-white absolute top-2 left-2">
            {navData.map(item => (
              <Link key={item.title} href={item.url} title={item.title} className="hover:text-red-500 flex items-center gap-2">
                <item.Icon size={25} /> {item.title}
              </Link>
            ))}
          </div>
        </section>

        {/* <section className="w-full container mx-auto text-xl sm:text-3xl leading-tight grid grid-cols-2 px-2 py-36 place-content-center">
          
        </section> */}

        <section className="w-full h-screen flex flex-col items-center justify-center text-center bg-[linear-gradient(to_top,forestgreen,seagreen_45%,#88CCCC,deepskyblue_55%,blue)]">
          <div className="bg-yellow-300 max-w-[90%] w-96 aspect-video border-8 border-black rounded-2xl flex flex-col items-center justify-center text-center">
            <h1 className="font-extrabold min-[300px]:text-2xl sm:text-4xl ">UNDER<br />CONSTRUCTION!</h1>
            <Link href="https://areebuzair.github.io" className="max-[300px]:text-xs hover:underline">Visit https://areebuzair.github.io for now, thnx!</Link>
          </div>
          <div className="w-4 h-26 bg-black"></div>
        </section>

        {/* <section className="mb-10 px-2">
      <h2 className="pb-10 font-mono">\My Projects</h2>
      <div className="flex items-center gap-2">
        <div className="border w-60 overflow-hidden">
          <div className="w-full h-40 bg-black text-white">
            Image
          </div>
          <div className="flex flex-col p-2 gap-2">
            <h3 className="text-xl justify line-clamp-3">Title: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere!</h3>
            <span className="text-sm text-gray-800"><time>2 min ago</time> in <a className="italic">Projects</a></span>
          </div>
        </div>


        <div className="w-16 h-16 flex items-center justify-center bg-gray-900 text-center rounded-full text-gray-400">
          Read More
        </div>
      </div>
    </section> */}

        {/* <aside className="w-60">
      <table><tbody>
        <tr>
          <td className='text-5xl font-extralight text-[#006B5E] p-2'>
            1
          </td>
          <td style={{ articleTitleStyle }}>
            <Link href={"#"} className="hover:underline">
              Hello! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis, recusandae.
            </Link>
          </td>
        </tr>
        <tr>
          <td className='text-5xl font-extralight text-[#006B5E] p-2'>
            1
          </td>
          <td style={{ articleTitleStyle }}>
            <Link href={"#"} className="hover:underline">
              Hello! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis, recusandae.
            </Link>
          </td>
        </tr>
        <tr>
          <td className='text-5xl font-extralight text-[#006B5E] p-2'>
            1
          </td>
          <td style={{ articleTitleStyle }}>
            <Link href={"#"} className="hover:underline">
              Hello! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis, recusandae.
            </Link>
          </td>
        </tr>
      </tbody></table>
    </aside> */}
      </main>
    </>
  );
}
