import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-32 sm:px-16  dark:bg-black">
       
        <div className="flex flex-col mx-auto   items-center gap-6 sm:items-start sm:text-left">
          <h1 className="md:text-5xl text-center text-4xl leading-10 tracking-tight text-black font-black dark:text-zinc-50">
            Welcome to MysteryFeedback
          </h1>
          <p className="text-lg text-center leading-8 text-zinc-600 dark:text-zinc-400">
            Send anonymous messages or suggestions to your friends, or generate messages using AI
          </p>
        </div>
      </main>
    </div>
  );
}
