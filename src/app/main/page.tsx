"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';

interface TimeCapsule {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("userId");
  }
  return false;
};

export default function MainPage() {
  const router = useRouter();
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signin");
    } else {
      fetchCapsules();
    }
  }, [router]);

  const fetchCapsules = async () => {
    try {
      const response = await fetch('http://localhost:5000/timecapsules', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userId')}`
        }
      });
      if (response.ok) {
        const data: TimeCapsule[] = await response.json();
        setCapsules(data);
      }
    } catch (error) {
      console.error('Error fetching capsules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    router.push("/signin");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:5000/timecapsules", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userId")}`,
        },
        body: formData,
      });

      if (response.ok) {
        setShowForm(false);
        fetchCapsules();
        setTitle("");
        setContent("");
        setImage(null);
      }
    } catch (error) {
      console.error("Error creating time capsule:", error);
    }
  };

  if (isLoading) {
    return <div className="text-black">Loading...</div>;
  }

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-100 to-purple-200 text-black">
      <nav className="w-full bg-indigo-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span
              className="text-2xl sm:text-3xl text-white"
              role="img"
              aria-label="Hourglass"
            >
              ⏳
            </span>
            <span className="text-lg sm:text-xl font-semibold text-white">
              Nitya and Aaron&apos;s Time Capsule
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-white border border-white rounded-full hover:bg-white hover:text-indigo-800 transition-colors duration-300"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">
          Your Time Capsules
        </h1>

        {showForm ? (
          <form
            onSubmit={handleSubmit}
            className="mb-8 bg-white p-6 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image
              </label>
              <input
                type="file"
                id="image"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="mt-1 block w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Capsule
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Capsule
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capsules.map((capsule) => (
            <div
              key={capsule._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                {capsule.title}
              </h2>
              <p className="text-gray-600 mb-2">
                Created: {new Date(capsule.createdAt).toLocaleDateString()}
              </p>
              {capsule.image && (
                <div className="mb-2 relative w-full h-48">
                  <Image
                    src={`data:image/jpeg;base64,${capsule.image}`}
                    alt={capsule.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                </div>
              )}
              <p className="text-gray-700">{capsule.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
