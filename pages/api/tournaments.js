import dbConnect from "../../backend/config/dbConnect";
import mongoose from "mongoose";

// Team schema (for matches)
const matchSchema = new mongoose.Schema({
  team1: { type: mongoose.Schema.Types.ObjectId, ref: "TournamentTeam", required: true },
  team2: { type: mongoose.Schema.Types.ObjectId, ref: "TournamentTeam", required: true },
});


// Tournament schema
const tournamentSchema = new mongoose.Schema({
  tournamentDate: { type: String, required: true },
  matches: [matchSchema],
  createdAt: { type: Date, default: Date.now },
});

const Tournament =
  mongoose.models.Tournament || mongoose.model("Tournament", tournamentSchema);

// Team collection schema (optional, just for fetching teams)
const teamSchema = new mongoose.Schema({
  team: String,
  logo: String,
});
const TournamentTeam =
  mongoose.models.TournamentTeam ||
  mongoose.model("TournamentTeam", teamSchema);

// Helper to generate matches
// Helper to generate exactly 4 matches (8 teams max)
function generateMatches(teamList) {
  if (!teamList || teamList.length < 8) return [];

  // Shuffle teams randomly
  const shuffled = [...teamList].sort(() => 0.5 - Math.random());

  // Pick exactly 8 unique teams (no duplicates)
  const selectedTeams = [];
  const seenTeams = new Set();

  for (let team of shuffled) {
    if (!seenTeams.has(team._id.toString())) {
      selectedTeams.push(team);
      seenTeams.add(team._id.toString());
    }
    if (selectedTeams.length === 8) break;
  }

  // Safety check
  if (selectedTeams.length < 8) return [];

  const matches = [];

  // Pair sequentially
  for (let i = 0; i < selectedTeams.length; i += 2) {
    matches.push({
      team1: selectedTeams[i],
      team2: selectedTeams[i + 1],
    });
  }

  return matches;
}

// API handler
export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const tournaments = await Tournament.find();
      return res.status(200).json(tournaments);
    }

    if (req.method === "POST") {
      const { date } = req.body;
      if (!date)
        return res
          .status(400)
          .json({ success: false, error: "Date is required" });

      const existingTournament = await Tournament.findOne({
        tournamentDate: date,
      });

      // Get all teams already in a tournament for this date
      let excludedTeamIds = [];
      if (existingTournament) {
        existingTournament.matches.forEach((match) => {
          if (match.team1?._id)
            excludedTeamIds.push(match.team1._id.toString());
          if (match.team2?._id)
            excludedTeamIds.push(match.team2._id.toString());
        });
      }

      // Fetch all teams excluding already used
      let availableTeams = await TournamentTeam.find({
        _id: { $nin: excludedTeamIds },
      });

      if (availableTeams.length < 8) {
        return res.status(400).json({
          success: false,
          error:
            "Not enough available teams. At least 8 unique teams are required",
        });
      }

      const matches = generateMatches(availableTeams);

      const newTournament =
        existingTournament ||
        new Tournament({
          tournamentDate: date,
          matches,
        });

      if (!existingTournament) await newTournament.save();

      return res.status(200).json({ success: true, data: newTournament });
    }

    if (req.method === "DELETE") {
      const { date } = req.query;
      if (!date)
        return res
          .status(400)
          .json({ success: false, error: "Date is required" });

      const deleted = await Tournament.deleteOne({ tournamentDate: date });
      if (deleted.deletedCount === 0)
        return res
          .status(404)
          .json({ success: false, error: "Tournament not found" });

      return res
        .status(200)
        .json({ success: true, message: "Tournament deleted" });
    }

    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
