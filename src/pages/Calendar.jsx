import { useEffect, useState } from "react";

const moodEmoji = {
  happy: "😊",
  sad: "😢",
  calm: "🌿",
  angry: "😠",
};

const moodText = {
  happy: "You've been in great spirits this month 💕",
  sad: "You've had a tougher month — be gentle with yourself 💙",
  calm: "You've been calm and balanced this month 🌿",
  angry: "You've been feeling angry this month 😠",
};

export default function Calendar() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("moodLogs") || "[]");
    setLogs(data);
  }, []);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getMoodForDay(day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const entry = logs.find((l) => l.date === dateStr);
    return entry ? moodEmoji[entry.mood] : "";
  }

  function getMonthMoodSummary() {
    const count = {};

    logs.forEach((l) => {
      const d = new Date(l.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        count[l.mood] = (count[l.mood] || 0) + 1;
      }
    });

    if (Object.keys(count).length === 0) return null;

    return Object.keys(count).reduce((a, b) =>
      count[a] > count[b] ? a : b
    );
  }

  const dominantMood = getMonthMoodSummary();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="cal-day empty" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(
      <div
        key={d}
        className={`cal-day ${d === new Date().getDate() ? "today" : ""}`}
        >
        <div className="emoji">{getMoodForDay(d)}</div>
        <div className="date">{d}</div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <h1 style={{ fontSize: "25px" }}>My Mood Calendar 🌸</h1>

      <div className="calendar-card">
        <div className="weekday-row">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        <div className="calendar-grid">{days}</div>
      </div>

      {dominantMood && (
        <p className="calendar-summary">
          {moodText[dominantMood]}
        </p>
      )}
    </div>
  );
}