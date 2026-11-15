import { Hero } from "./Hero";
import { Icon } from "./Icon";
import { StoryMotion } from "./StoryMotion";
import { TRI_D } from "./sprite.generated";

const cards = [
  { cls: "mcard-1", icon: "card-icon", size: 95, title: "Collections", body: "Send and receive money instantly with secure, seamless payment solutions." },
  { cls: "mcard-2", icon: "card-icon-lg", size: 140, title: "Financial Insights", body: "Turn financial data into clear insights and smarter decisions with intelligent analytics built your financial future." },
  { cls: "mcard-3", icon: "card-icon", size: 95, title: "Digital banking", body: "Manage finances effortlessly flexible, secure, connected banking tools." },
];

/*
  One pinned scene for the first ~5 screens of scroll (StoryMotion.tsx drives it):
  hero → the triangle on the "i" grows, flips and grows a stem into a Y → the Y's three strokes become the borders of the product cards.
  Without JS (or with reduced motion) the hero and the cards simply stack.
*/
export function Story() {
  return (
    <section className="story" id="story" aria-label="Yubit Pay">
      <div className="story-pin" id="story-pin">
        <Hero />

        <div className="cards" id="cards">
          <div className="tint" id="tint" aria-hidden="true" />
          <div className="intro">
            <h2 className="intro-h" id="intro-h">
              Everything your product needs{" "}
              <br />
              to move money forward.
            </h2>
            <p className="intro-p" id="intro-p">Build connected financial experiences with a modular API stack. Pick what you need. Expand as you grow.</p>
          </div>
          <div className="catalog">
            {cards.map((c) => (
              <article key={c.title} className={`mcard ${c.cls}`} data-mcard>
                <div className="fill" aria-hidden="true" data-fill />
                <div data-l><Icon n={c.icon} w={c.size} /></div>
                <div className="mcard-text">
                  <h3 className="mcard-title" data-l>{c.title}</h3>
                  <p className="mcard-body" data-l>{c.body}</p>
                </div>
                <a className="mcard-btn" href="#" data-l>Explore</a>
              </article>
            ))}
          </div>
        </div>

        <div className="y-glow" id="y-glow" aria-hidden="true" />
        <p className="y-label mono" id="y-label" aria-hidden="true">One integration. More potential.</p>
        <svg className="mark" id="mark" aria-hidden="true">
          <g id="y-mark">
            <g className="tri-pop">
              <path id="y-tri" d={TRI_D} fill="#C0F476" />
              <rect id="y-stem" fill="#C0F476" x="78.31" y="1.6" width="2" height="0" />
            </g>
          </g>
          {[0, 1, 2].map((j) => (
            <g key={j} data-line={j}>
              <line data-glow="" />
              <line data-core="" />
            </g>
          ))}
          {[0, 1, 2].map((k) => (
            <g key={k} data-card={k}>
              <path className="border" /><path className="border" /><path className="border" /><path className="border" />
            </g>
          ))}
        </svg>
        <StoryMotion />
      </div>
    </section>
  );
}
