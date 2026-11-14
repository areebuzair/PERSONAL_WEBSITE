import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/home.module.css"
import FluidBg from "@/components/landing_page/FluidBg";

export default function Home() {

  console.log(styles)
 
  return (
    <>
      <FluidBg />
      <main className="max-w-full">
        <section className="hero p-5">
          
          <div className="m-10 bg-red-700 box-border px-2 sm:px-10 md:px-20 py-36 flex justify-center items-center text-center flex-col">
            <h1 className="text-lg text-white">J. M Areeb Uzair Alam</h1>
            <big className="text-yellow-300 text-xl sm:text-5xl md:text-8xl font-bold">Websites should be fast!</big>
          </div>
        </section>

        <section className="w-full h-screen container mx-auto">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet, quis doloremque necessitatibus at officia voluptas quae debitis exercitationem deleniti beatae?
        </section>

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
