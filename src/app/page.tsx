"use client";

import Head from "next/head";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Placeholder function to check if user is authenticated
const isAuthenticated = () => {
  // Replace this with your actual authentication check
  return false;
};

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBeginJourney = () => {
    if (isAuthenticated()) {
      router.push('/main'); // Route to main page if authenticated
    } else {
      router.push('/signin'); // Route to sign in page if not authenticated
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Time Capsule App</title>
        <meta
          name="description"
          content="Send messages to yourself or others, scheduled for future delivery."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-100 to-purple-200">
        <nav className="w-full bg-indigo-800 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl text-white" role="img" aria-label="Hourglass">
                ⏳
              </span>
              <span className="text-lg sm:text-xl font-semibold text-white">
                Time Capsule
              </span>
            </div>
            <Link href="/signin" className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-white border border-white rounded-full hover:bg-white hover:text-indigo-800 transition-colors duration-300">
              Sign In
            </Link>
          </div>
        </nav>

        <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
          <div className="relative max-w-sm w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-800 mb-4 animate-[bounce-in_1s_ease-out]">
              Welcome to Our Time Capsule !
            </h1>
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-indigo-600"></div>
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-indigo-600"></div>
          </div>
          <p className="mt-4 text-lg sm:text-xl text-indigo-700 text-center max-w-xs sm:max-w-sm">
            Send messages through time, bridging moments with words.
          </p>
          <button 
            onClick={handleBeginJourney}
            className="mt-8 sm:mt-12 px-6 py-3 text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm sm:text-base"
          >
            Begin Your Journey
          </button>
          <div className="mt-12 sm:mt-16 text-indigo-400 text-4xl sm:text-6xl font-light">⏳</div>
        </main>
      </div>
    </>
  );
}
