// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // your Supabase client
import { Link } from "react-router-dom";

const Home = () => {
  const [dailyStrength, setDailyStrength] = useState(null);
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch today's daily strength
  const fetchDailyStrength = async () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const { data, error } = await supabase
      .from("daily_strength")
      .select("*")
      .eq("date", today)
      .single();

    if (error) {
      console.error("Error fetching daily strength:", error.message);
    } else {
      setDailyStrength(data);
    }
  };

  // Fetch prayers (all, ordered latest first)
  const fetchPrayers = async () => {
    const { data, error } = await supabase
      .from("prayer")
      .select("id, content, created_at") // no user info
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching prayers:", error.message);
    } else {
      setPrayers(data);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDailyStrength(), fetchPrayers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6">Her Quiet Place</h1>

      {/* Daily Strength Section */}
      <section className="mb-8 bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">🌿 Daily Strength</h2>
        {dailyStrength ? (
          <div>
            <p className="text-gray-700">{dailyStrength.message}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(dailyStrength.date).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No message for today yet.</p>
        )}
      </section>

      {/* Community Prayers Section */}
      <section className="mb-8 bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">🙏 Community Prayers</h2>
        {prayers.length > 0 ? (
          <ul className="space-y-3">
            {prayers.map((prayer) => (
              <li
                key={prayer.id}
                className="p-3 border rounded-lg bg-gray-50 text-gray-700"
              >
                <p>{prayer.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(prayer.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No prayers yet. Be the first to share 🙏
          </p>
        )}
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <Link
          to="/submit-prayer"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 mr-2"
        >
          Submit a Prayer
        </Link>
        <Link
          to="/signin"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 mr-2"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
        >
          Sign Up
        </Link>
      </section>
    </div>
  );
};

export default Home;
