import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

export default function AdminContacts() {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500 text-center text-3xl font-bold">
        Access Denied. Admins only.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-green-400 mb-8">
        Admin - Contact Submissions
      </h1>

      {contacts.length === 0 ? (
        <p className="text-gray-400 text-center">No contacts yet.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((c, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-700"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-green-400">{c.name}</h2>
                <span className="text-xs text-gray-400">
                  {new Date(c.date).toLocaleString()}
                </span>
              </div>

              <p className="text-gray-300 mb-2">
                <span className="font-medium text-indigo-400">Email:</span> {c.email}
              </p>

              <p className="text-gray-300">
                <span className="font-medium text-indigo-400">Message:</span> {c.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
