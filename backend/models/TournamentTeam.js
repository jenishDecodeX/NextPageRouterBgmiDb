import mongoose from "mongoose";

const TournamentTeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    game: { type: String, required: true, trim: true },
    team: { type: String, required: true, trim: true },
    registeredAt: { type: String, default: () => new Date().toLocaleString() },
    status: { type: String, default: "Pending" }, // Optional: Pending / Approved / Rejected
  },
  { collection: "tournamentTeam" }
);

export default mongoose.models.TournamentTeam ||
  mongoose.model("TournamentTeam", TournamentTeamSchema);
