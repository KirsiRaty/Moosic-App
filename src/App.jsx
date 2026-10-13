import { useEffect, useState } from "react";
import MoodSelector from "./components/MoodSelector";
import PlaylistCard from "./components/PlaylistCard";
import { playlists } from "./utils/playlists";
import { getNextItem } from "./utils/playlistLogic";
import "./styles.css";
import Calendar from "./pages/Calendar";

function App() {
  const [mood, setMood] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [showMoodOptions, setShowMoodOptions] = useState(false);
  const [moodOptionMood, setMoodOptionMood] = useState(null);
  const [playlistCategory, setPlaylistCategory] = useState(null);
  const [page, setPage] = useState("home");

  // jos on offline
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // muistaa viimeisimmän käynnin
  const [lastMood, setLastMood] = useState(null);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  // lataa viimeisen session mood jos sellainen on
  useEffect(() => {
    const savedMood = localStorage.getItem("lastMood");

    if (savedMood) {
      setLastMood(savedMood);
    }

  }, []);

  // tallentaa session
  function saveSession(mood, playlist) {
    if (!mood || !playlist) return;

    localStorage.setItem("lastMood", mood);
    localStorage.setItem("lastPlaylist", playlist);

    setLastMood(mood);
  }

  function saveMoodToCalendar(mood) {
    const today = new Date().toISOString().split("T")[0];

    const existing = JSON.parse(localStorage.getItem("moodLogs") || "[]");

    const updated = existing.filter((entry) => entry.date !== today);

    updated.push({
      date: today,
      mood,
    });

    localStorage.setItem("moodLogs", JSON.stringify(updated));
  }

  function handleMoodSelect(selectedMood) {
    setMood(selectedMood);
    setPlaylist(null);
    setPlaylistCategory(null);

    saveMoodToCalendar(selectedMood);

    if (selectedMood === "sad" || selectedMood === "angry") {
      setShowMoodOptions(true);
      setMoodOptionMood(selectedMood);
      return;
    }

    setShowMoodOptions(false);
    setMoodOptionMood(null);

    const list = playlists[selectedMood];

    if (!list) return;

    const link = getNextItem(list, selectedMood);

    setPlaylist(link);
    saveSession(selectedMood, link);
  }

  function handleMoodChoice(type) {
    setShowMoodOptions(false);
    setMoodOptionMood(null);

    const moodKey = moodOptionMood || mood;

    if (!moodKey) return;

    const key =
      moodKey === "sad"
        ? type === "feel"
          ? "inmyfeels"
          : "cheer"
        : type === "feel"
          ? "stayangry"
          : "calmdown";

    const list = playlists[moodKey][key];

    if (!list) return;

    const link = getNextItem(list, key);

    setPlaylist(link);
    setPlaylistCategory(key);
    saveSession(moodKey, link);
  }

  function handleTryAnother() {
    if (!mood) return;

    if ((mood === "sad" || mood === "angry") && playlistCategory) {
      const list = playlists[mood][playlistCategory];
      const link = getNextItem(list, playlistCategory);

      setPlaylist(link);
      saveSession(mood, link);
      return;
    }

    const list = playlists[mood];

    if (!list) return;

    const link = getNextItem(list, mood);

    setPlaylist(link);
    saveSession(mood, link);
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Moosic</h1>

      {isOffline && (
        <div className="offline-banner">
          📴 You’re currently offline
          {lastMood ? ` — last saved mood: ${lastMood}` : ""}
        </div>
      )}

      {!isOffline && !mood && lastMood && (
        <div className="offline-banner">
          💕 Welcome back — last time you were feeling: {lastMood}
        </div>
      )}

      <div style={{ marginBottom: "45px" }}>
        <button onClick={() => setPage("home")}>🎵 Home</button>
        <button onClick={() => setPage("calendar")}>📅 Calendar</button>
      </div>

      {page === "home" && (
        <>
          {!mood && <MoodSelector onSelect={handleMoodSelect} />}

          {showMoodOptions && (
            <div className="mood-container">
              <h2>How are you feeling?</h2>

              <button onClick={() => handleMoodChoice("cheer")}>
                {moodOptionMood === "angry" ? "😌 Calm me down" : "😊 Cheer me up"}
              </button>

              <button onClick={() => handleMoodChoice("feel")}>
                🌧️ Stay in my feelings
              </button>
            </div>
          )}

          {playlist && (
            <PlaylistCard playlist={playlist} onNext={handleTryAnother} />
          )}

          {mood && (
            <button
              style={{ marginTop: "20px" }}
              onClick={() => {
                setMood(null);
                setPlaylist(null);
                setShowMoodOptions(false);
                setMoodOptionMood(null);
                setPlaylistCategory(null);
              }}
            >
              ← Change mood
            </button>
          )}
        </>
      )}

      {page === "calendar" && <Calendar />}
    </div>
  );
}

export default App;