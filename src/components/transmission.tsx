import { useEffect, useState } from "react";

const now = new Date().toLocaleString("en-GB", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});


const messages = [
  { delay: 1000, text: `> [${now}] connection established.` },
  { delay: 2500, text: `> [${now}] initializing memory core...` },
  { delay: 4000, text: `> [${now}] loading J archive...` },
  { delay: 5500, text: `> [${now}] loading Memories since Dec 14 2023...` },

  { delay: 7500, text: ">" },
  { delay: 9000, text: "> receiving transmission..." },
  { delay: 10500, text: ">_" },

  { delay: 12000, text: "First Impression : J 4 Jada Thendi!!" },
  { delay: 14500, text: ">" },
  { delay: 16000, text: "> decrypting acronym..." },
  { delay: 16500, text: ">_" },

  { delay: 18500, text: "J - Joyful Journeys ☺️" },
  { delay: 20500, text: "O - Open-Minded Adventurer 🫡" },
  { delay: 22500, text: "S - Stardust Collected ⭐" },
  { delay: 24500, text: "M - Moonlit Memories 🙂‍↕️" },
  { delay: 26500, text: "I - Inexplicably Awesome 😲" },

  { delay: 28500, text: ">" },
  { delay: 30000, text: "> continuing transmission..." },
  { delay: 31500, text: ">_" },

  { delay: 33500, text: "Somehow became favorite person for all of us." },
  { delay: 36000, text: "Thanks for making ordinary days memorable." },
  { delay: 38500, text: "You have a strange talent for making people feel included." },
  { delay: 41000, text: "Even random conversations become core memories somehow." },

  { delay: 46000, text: ">" },
  { delay: 47500, text: "> retrieving archived moments..." },
  { delay: 49000, text: ">_" },

  { delay: 51000, text: "• The unexpected laughs." },
  { delay: 53500, text: "• The completely unnecessary arguments." },
  { delay: 56000, text: "• The chaotic group conversations." },
  { delay: 58500, text: "• The moments that became memories." },
  { delay: 61000, text: "• The random late-night conversation." },

  { delay: 63500, text: "__BLANK__" },

  { delay: 65500, text: "You are genuinely one of a kind." },

  { delay: 68000, text: "__BLANK__" },

  { delay: 70000, text: "All the best Fave ❤️." },

  { delay: 72500, text: ">" },
  { delay: 74000, text: "> transmission complete." },
  { delay: 76000, text: `> [${now}] archive significance: Memories till 30 May 2026` },
  { delay: 78500, text: `> [${now}] emotional impact: Immeasurable` },
  { delay: 79000, text: `> [${now}] Exit(0)` },
];

export default function Transmission() {
  const [lines, setLines] = useState<string[]>(
    Array(messages.length).fill("")
  );

  const [activeLine, setActiveLine] = useState(-1);

  useEffect(() => {
    messages.forEach((msg, index) => {
      setTimeout(() => {
        setActiveLine(index);
        let current = "";
        let i = 0;

        if (msg.text === "") {
          setLines(prev => {
            const copy = [...prev];
            copy[index] = "";
            return copy;
          });

          return;
        }

        const interval = setInterval(() => {
          current += msg.text[i];
          i++;

          setLines(prev => {
            const copy = [...prev];
            copy[index] = current;
            return copy;
          });

          if (i >= msg.text.length) {
            clearInterval(interval);
          }
        }, 25);
      }, msg.delay);
    });
  }, []);

  return (
    <div>
      <div>
        <div className="terminal-header">
        &gt; MEMORY_CORE://Joz_Jo-Archive/
        </div>
      </div>

      <div>  
        <div >
          {lines.map((line, index) =>
            line === "__BLANK__" ? (
              <div key={index} className="terminal-spacer" />
            ) : (
              <p
                key={index}
                className={
                  line.startsWith(">")
                    ? "terminal-command"
                    : "transmission-line"
                }
              >
                {line}

                {activeLine === index && (
                  <span className="cursor">▋</span>
                )}
              </p>
            )
          )}
        </div>
      </div>

    </div>
  );
}