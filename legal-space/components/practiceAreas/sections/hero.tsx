import { cookies } from "next/headers";

function PracticeAreaHeroSection() {
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "geo";
  return (
    <main className="w-full min-h-screen bg-practice-hero bg-cover bg-fixed bg-center relative flex justify-center items-center">
      {/* Filter */}
      <div className="absolute w-full h-full top-0 bg-black opacity-80"></div>

      {/* Text and Image */}
      <div className="flex flex-col w-[90%] gap-10 relative max-w-[310px] md:flex-row md:max-w-[730px] lg:max-w-[1100px]">
        {/* Text */}
        <aside className="w-full md:flex md:justify-center md:items-center ">
          <h1 className="text-center text-3xl md:text-5xl tracking-widest font-semibold text-main-green-light">
            {lang === "eng"
              ? "Practice Areas and Services"
              : "ჩვენი სამუშაო სფერო და სერვისები"}
          </h1>
        </aside>
      </div>
    </main>
  );
}

export default PracticeAreaHeroSection;
