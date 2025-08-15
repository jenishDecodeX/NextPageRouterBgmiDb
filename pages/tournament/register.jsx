"use client";
import { useState, useEffect } from "react";

export default function TournamentRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    game: "",
    team: "",
  });
  const [message, setMessage] = useState("");
  const [registrations, setRegistrations] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.game || !formData.team) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/tournamentTeam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage("Registration successful!");
        setFormData({ name: "", email: "", phone: "", game: "", team: "" });
        fetchRegistrations(); // refresh the list after submission
      } else {
        setMessage(result.error || "Something went wrong.");
      }
    } catch {
      setMessage("Server error. Please try again later.");
    }
  };

  // Fetch registrations from MongoDB
  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/tournamentTeam");
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-lg mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Tournament Registration</h1>
        {message && <p className="mb-4 text-center text-yellow-400">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded bg-gray-700 focus:outline-none" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-3 rounded bg-gray-700 focus:outline-none" required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded bg-gray-700 focus:outline-none" required />
          <select name="game" value={formData.game} onChange={handleChange} className="w-full p-3 rounded bg-gray-700 focus:outline-none" required>
            <option value="">Select Game</option>
            <option value="pubg pc">PUBG PC</option>
            <option value="bgmi">BGMI</option>
            <option value="pubg mobile">PUBG Mobile</option>
          </select>
          <input type="text" name="team" placeholder="Team Name" value={formData.team} onChange={handleChange} className="w-full p-3 rounded bg-gray-700 focus:outline-none" required />
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 p-3 rounded font-bold">Register</button>
        </form>
      </div>
    </div>
  );
}
