import { useState, useEffect, useMemo } from "react";
import "./App.css";

const emojiList = [
  { id: 1, emoji: "🔥", label: "fire" },
  { id: 2, emoji: "🌟", label: "star" },
  { id: 3, emoji: "💖", label: "heart" },
  { id: 4, emoji: "👍", label: "thumbs up" },
  { id: 5, emoji: "👎", label: "thumbs down" },
  // add more emojis as needed
];

// random rotation between -45deg and 45deg
const Emoji = (emoji, i) => {
  return (
    <p
      id={emoji.x * emoji.y}
      style={{
        position: "absolute",
        left: emoji.x - 16,
        top: emoji.y - 16,
        margin: "0px",
        cursor: "default",
      }}
      key={i}
    >
      {emoji.emoji}
    </p>
  );
};

function App() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [emojis, setEmojis] = useState(() => {
    return JSON.parse(localStorage.getItem("emojis")) || [];
  });
  function handleMouseMove(event) {
    setCursorPos({ x: event.clientX, y: event.clientY });
  }

  function handlePlaceEmoji(event) {
    if (
      selectedFeature &&
      event.target.tagName !== "BUTTON" &&
      event.target.tagName !== "FOOTER"
    ) {
      setEmojis((prev) => [
        ...prev,
        {
          emoji: selectedFeature,
          x: event.clientX,
          y: event.clientY,
          id: event.clientX * event.clientY,
        },
      ]);
    }
  }

  function clearScreen() {
    setEmojis([]);
  }

  function handleMoveEmojis(e) {
    // not pretty solution :(
    console.log;
    if (e.target.tagName === "P") {
      handleRemoveEmojis(e);
      setSelectedFeature(e.target.innerText);
    }
  }

  function handleRemoveEmojis(e) {
    //  remove selected emoji
    if (e.target.tagName === "P") {
      setEmojis((prev) => {
        return prev.filter((emoji) => emoji.id !== parseInt(e.target.id));
      });
    }
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("emojis", JSON.stringify(emojis));
  }, [emojis]);

  useEffect(() => {
    let func;
    switch (selectedFeature) {
      case "🗑️": {
        func = handleRemoveEmojis;
        break;
      }
      case "🔀": {
        func = handleMoveEmojis;
        break;
      }
      case "🧹": {
        return clearScreen();
      }
      default: {
        func = handlePlaceEmoji;
      }
    }
    window.addEventListener("click", func);
    return () => {
      window.removeEventListener("click", func);
    };
  }, [selectedFeature]);

  function renderCursor() {
    if (emojiList.map((obj) => obj.emoji).includes(selectedFeature)) {
      return (
        <div
          style={{
            position: "absolute",
            left: cursorPos.x - 16,
            top: cursorPos.y - 16,
            opacity: 0.7,
            pointerEvents: "none",
            zIndex: "9999",
          }}
        >
          {selectedFeature}
        </div>
      );
    }
    return "";
  }

  return (
    <div className="App">
      {renderCursor()}
      {emojis.map((emoji, i) => Emoji(emoji, i))}
      <footer>
        {emojiList.map((emoji) => (
          <button
            key={emoji.id}
            onClick={() => setSelectedFeature(emoji.emoji)}
          >
            {emoji.emoji}
          </button>
        ))}
        <button
          title="move"
          style={{ marginLeft: "1rem" }}
          onClick={() => setSelectedFeature("🔀")}
        >
          🔀
        </button>
        <button title="bin" onClick={() => setSelectedFeature("🗑️")}>
          🗑️
        </button>
        <button title="clear" onClick={() => setSelectedFeature("🧹")}>
          🧹
        </button>
      </footer>
    </div>
  );
}

export default App;
