import Image from "next/image";
import Link from "next/link";

const articleTitleStyle = {
  fontSize: '1.0rem',
  lineHeight: 0.9,
  maxHeight: 'calc(0.9em * 3)',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
};

function formatTimeAgo(date: string) {
  const date_formatter = new Intl.RelativeTimeFormat("en-uk", {
    numeric: "auto",
  })

  const today = new Date();
  const DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ]
  let duration = (new Date(date) - today) / 1000

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.amount) {
      return date_formatter.format(Math.round(duration), division.name)
    }
    duration /= division.amount
  }
}

export default function Home() {
  return (<main>
    <section className="w-full min-h-screen bg-blue-200 bg-[url('../../public/pexels-frostroomhead-17356711.jpg')] bg-center bg-cover text-white font-extrabold font-sans border-y-50 border-[#ededed] flex flex-col items-center justify-end relative">
      <h1 className="text-[20vmin] overflow-y-hidden  text-shadow-black text-shadow-2xs ">J. M AREEB</h1>
      <p className="italic">I develop UI that works on all devices</p>
    </section>
    {/* <section className="min-h-screen px-5">
      <h2 className="py-10 font-mono">\Latest Blogs</h2>
      <div className="flex items-center gap-2">
        <div className="bg-amber-200 w-60 h-80">

        </div>
        
        
        <div className="w-16 h-16 flex items-center justify-center bg-white text-center rounded-full text-black">
          Read More
        </div>
      </div>
    </section> */}

    <section className="mb-10 px-2">
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
    </section>
    <aside className="w-60">
      <table><tbody>
        <tr>
          <td className='text-5xl font-extralight text-[#006B5E] p-2'>
            1
          </td>
          <td style={articleTitleStyle}>
            <Link href={"#"} className="hover:underline">
              Hello! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis, recusandae.
            </Link>
          </td>
        </tr>
      </tbody></table>
    </aside>
  </main>
  );
}
