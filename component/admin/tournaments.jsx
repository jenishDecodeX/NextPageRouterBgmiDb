"use client";
import { useEffect, useState } from "react";

export default function AdminTournament() {
  const [date, setDate] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch tournaments
  const fetchTournaments = async () => {
    try {
      const res = await fetch("/api/tournaments");
      const data = await res.json();
      if (Array.isArray(data)) setTournaments(data);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  // Save date & generate matches
  const saveDate = async () => {
    if (!date) return alert("Please select a date!");
    try {
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const data = await res.json();
      if (data.success) {
        setTournaments((prev) => {
          const exists = prev.some(
            (t) => t.tournamentDate === data.data.tournamentDate
          );
          if (exists) return prev;
          return [...prev, data.data];
        });
        alert(`Matches generated for date: ${data.data.tournamentDate}`);
      } else alert(data.error);
    } catch (err) {
      console.error("Error saving date:", err);
    }
  };

  // Delete tournament
  const deleteTournament = async (date) => {
    if (!confirm(`Delete tournament for ${date}?`)) return;
    try {
      const res = await fetch(`/api/tournaments?date=${date}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setTournaments((prev) => prev.filter((t) => t.tournamentDate !== date));
        alert("Tournament deleted");
      } else alert(data.error);
    } catch (err) {
      console.error(err);
      alert("Failed to delete tournament");
    }
  };

  // Filter by selected date
  const filteredTournaments = selectedDate
    ? tournaments.filter((t) => t.tournamentDate === selectedDate)
    : tournaments;

  return (
    <div className="min-h-[70vh] pt-12">
      <div className="bg-white shadow-lg text-black rounded-xl p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin - Tournament</h1>

        {/* Date input */}
        <div className="flex gap-3 items-center mb-6">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
          <button
            onClick={saveDate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Save & Generate Matches
          </button>
        </div>

        {/* Dropdown to filter */}
        {tournaments.length > 0 && (
          <div className="mb-6">
            <label className="mr-2 font-semibold">
              View Tournament by Date:
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg p-2"
            >
              <option value="">All Dates</option>
              {tournaments.map((t, idx) => (
                <option key={idx} value={t.tournamentDate}>
                  {t.tournamentDate}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Display tournaments */}
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((tournament, idx) => (
            <div key={idx} className="mb-8 border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold">
                  Tournament Date: {tournament.tournamentDate}
                </p>
                <button
                  onClick={() => deleteTournament(tournament.tournamentDate)}
                  className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              <h2 className="text-lg font-bold mb-2">Matches</h2>
              <div className="space-y-3">
                {tournament.matches.map((match, mIdx) => (
                  <div
                    key={mIdx}
                    className="flex items-center gap-4 border p-3 rounded-lg"
                  >
                    {/* Team 1 */}
                    <div className="flex items-center gap-2">
                      {match.team1 ? (
                        <>
                          {match.team1.logo ? (
                            <img
                              src={match.team1.logo}
                              alt={match.team1.team}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                              N/A
                            </div>
                          )}
                          <span>{match.team1.team}</span>
                        </>
                      ) : (
                        <span className="italic text-gray-500">No Team</span>
                      )}
                    </div>

                    <span className="font-bold">VS</span>

                    {/* Team 2 */}
                    <div className="flex items-center gap-2">
                      {match.team2 ? (
                        <>
                          {match.team2.logo ? (
                            <img
                              src={match.team2.logo}
                              alt={match.team2.team}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                              N/A
                            </div>
                          )}
                          <span>{match.team2.team}</span>
                        </>
                      ) : (
                        <span className="italic text-gray-500">Bye</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No tournaments found</p>
        )}
      </div>
    </div>
  );
}
