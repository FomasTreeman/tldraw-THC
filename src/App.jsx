import { useState, useEffect } from "react";
import "./App.css";

const emojiList = [
  { id: 1, emoji: "🔥", label: "fire" },
  { id: 2, emoji: "🌟", label: "star" },
  { id: 3, emoji: "💖", label: "heart" },
  { id: 4, emoji: "👍", label: "thumbs up" },
  { id: 5, emoji: "👎", label: "thumbs down" },
  // add more emojis as needed
];

function App() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  function handleEmojiClick(emoji) {
    setSelectedEmoji(emoji.emoji);
  }

  function handleScreenClick(event) {
    console.log(event.target.tagName);
    if (
      selectedEmoji &&
      event.target.tagName !== "BUTTON" &&
      event.target.tagName !== "FOOTER"
    ) {
      const emojiElement = document.createElement("p");
      emojiElement.innerText = selectedEmoji;
      emojiElement.style.position = "absolute";
      emojiElement.style.left = `${event.clientX - 16}px`;
      emojiElement.style.top = `${event.clientY - 16}px`;
      emojiElement.style.margin = "0px";
      emojiElement.style.cursor = "default";
      document.body.appendChild(emojiElement);
    }
  }

  if (selectedEmoji) {
    window.addEventListener("mousemove", (event) => {
      setCursorPos({ x: event.clientX, y: event.clientY });
    });
  }

  useEffect(() => {
    window.addEventListener("click", handleScreenClick);
    return () => {
      window.removeEventListener("click", handleScreenClick);
    };
  }, [selectedEmoji]);

  return (
    <div className="App">
      <div
        style={{
          position: "absolute",
          left: cursorPos.x - 16,
          top: cursorPos.y - 16,
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: "9999",
        }}
        onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
      >
        {selectedEmoji}
      </div>
      <footer>
        {emojiList.map((emoji) => (
          <button key={emoji.id} onClick={() => handleEmojiClick(emoji)}>
            {emoji.emoji}
          </button>
        ))}
      </footer>
    </div>
  );
}

export default App;
