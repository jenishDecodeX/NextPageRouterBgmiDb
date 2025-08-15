"use client";
import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { FaGamepad, FaUsers, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Players() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [players, setPlayers] = useState([]);
  const [selectedGame, setSelectedGame] = useState("All");

  // Fetch players from MongoDB via API
  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/tournamentTeam");
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      console.error("Error fetching players:", err);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Filter players by selected game
  const filteredPlayers =
    selectedGame === "All"
      ? players
      : players.filter(
          (p) => p.game.toLowerCase() === selectedGame.toLowerCase()
        );

  if (!user || user.role !== "admin") {
    return (
      <p className="p-10 min-w-[93vw] text-center pt-40 text-3xl text-red-500">
        Access Denied. Admins only.
      </p>
    );
  }

  return (
    <>
      <Head>
        <title>Teams Dashboard</title>
      </Head>

      <div className="bg-[#0e0e0e] text-white flex flex-col min-h-screen">
        {/* Header + Filter */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-b border-gray-800 sticky top-0 py-8 bg-[#0e0e0e] z-10">
          <div>
            <h1 className="text-3xl font-bold text-indigo-400">🎮 Teams Dashboard</h1>
            <span className="text-sm text-gray-400">
              Total Teams: {filteredPlayers.length}
            </span>
          </div>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-indigo-500 transition-all mt-2 sm:mt-0"
          >
            <option value="All">All Games</option>
            <option value="BGMI">BGMI</option>
            <option value="PUBG Mobile">PUBG Mobile</option>
            <option value="PUBG PC">PUBG PC</option>
          </select>
        </div>

        {/* Player Cards */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredPlayers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((p) => (
                <div
                  key={p._id}
                  className="bg-[#1a1a1a] rounded-xl shadow-lg p-5 border border-gray-800 hover:border-indigo-500 hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{p.name}</h2>
                    <span className="text-xs text-gray-500">{p.registeredAt}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p className="flex items-center gap-2">
                      <FaEnvelope className="text-indigo-400" /> {p.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaPhone className="text-green-400" /> {p.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaGamepad className="text-yellow-400" /> Game:{" "}
                      <span className="capitalize">{p.game}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaUsers className="text-pink-400" /> Team: {p.team}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Stats
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-20 text-lg">
              No teams found for this game.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
