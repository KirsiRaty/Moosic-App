export default function MoodSelector({ onSelect }) {
  return (
    <div className="mood-container">
      <h2>How are you feeling?</h2>

      <button onClick={() => onSelect("happy")}>
        Happy 😊
      </button>

      <button onClick={() => onSelect("sad")}>
        Sad 😢
      </button>

      <button onClick={() => onSelect("calm")}>
        Calm 🌿
      </button>

      <button onClick={() => onSelect("angry")}>
        Angry 😠
      </button>
    </div>
  );
}