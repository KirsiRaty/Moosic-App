export default function PlaylistCard({ playlist, onNext }) {
  if (!playlist) return null;

  // muuttaa spotify linkin embed linkiks
  const embedUrl = playlist.replace(
    "open.spotify.com/playlist/",
    "open.spotify.com/embed/playlist/"
  );

  return (
    <div className="card">
      <h2>Your playlist 🎧</h2>

      <iframe
        style={{ borderRadius: "12px", marginTop: "10px" }}
        src={embedUrl}
        width="100%"
        height="380"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Playlist"
      ></iframe>

      <div style={{ marginTop: "15px" }}>
        <button className="primary-btn" onClick={onNext}>
          Try another 🔄
        </button>
      </div>
    </div>
  );
}