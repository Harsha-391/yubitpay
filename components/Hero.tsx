import connAvif from "@/assets/img/connector-1552.avif";
import connWebp from "@/assets/img/connector-1552.webp";
import { TRI_D } from "./sprite.generated";
import { Icon } from "./Icon";

// 4 curved connectors = one sprite; the other corners are flips of it (positions from Figma).
const connectors = [
  { cls: "c1", left: 225, top: 84, flip: "none" },
  { cls: "c2", left: 847, top: 84, flip: "scaleX(-1)" },
  { cls: "c3", left: 225, top: 209, flip: "scaleY(-1)" },
  { cls: "c4", left: 847, top: 244, flip: "scale(-1,-1)" },
];

const principles = [
  { icon: "braces", text: "RESTful APIs" },
  { icon: "webhook", text: "Real-time webhooks" },
  { icon: "terminal", text: "Developer-first integration" },
  { icon: "indian-rupee", text: "India-native infrastructure" },
];

const px = (n: number) => `calc(${n} * var(--u))`;

export function Hero() {
  return (
    <section className="hero" aria-label="Hero" data-idle>
      <div className="flutes" aria-hidden="true" />
      <div className="flute-glow" aria-hidden="true" />
      <svg className="glow" aria-hidden="true">
        <use href="#ambient-glow" />
      </svg>

      <div className="copy">
        <div className="titles">
          <h1 className="head">
            <span className="h1 t1">Your next big idea.</span>
            <span className="h1 h1-lime t2">Our financial infrastructure.</span>
          </h1>
          <p className="sub">Connect payments, payouts and open banking with developer-friendly APIs. Less complexity. More possibility.</p>
        </div>
        <div className="actions">
          <a className="btn btn-lime btn-a" href="#" data-magnet>
            Start building
            <Icon n="arrow-up-right-dark" w={18} />
          </a>
          <a className="btn btn-ghost btn-b" href="#" data-magnet>
            Explore the APIs
            <Icon n="arrow-up-right-light" w={18} />
          </a>
        </div>
      </div>

      <div className="illu" id="illu">
        {/* the Figma sculpture image is replaced by the Yubit Pay mark (vector); its triangle is the start of the scroll story */}
        <div className="abs sculpt-wrap" style={{ inset: 0 }}>
          <div className="abs logo-big">
            <svg viewBox="0 0 100 47" role="img" aria-label="Yubit Pay">
              <use href="#logo-word" width="100" height="47" />
              <path className="tri-static" d={TRI_D} fill="#C0F476" />
            </svg>
          </div>
        </div>

        {connectors.map((c) => (
          <div key={c.cls} className={`abs conn ${c.cls}`} style={{ left: px(c.left), top: px(c.top) }} aria-hidden="true">
            <div className="conn-flip" style={{ transform: c.flip }}>
              <picture>
                <source type="image/avif" srcSet={connAvif.src} />
                <img src={connWebp.src} width={776} height={190} alt="" loading="lazy" decoding="async" />
              </picture>
            </div>
          </div>
        ))}

        <div className="rays" aria-hidden="true">
          {[40, 140, 220, 320].map((deg) => (
            <div key={deg} className="ray" style={{ transform: `rotate(${deg}deg)` }}>
              <i />
            </div>
          ))}
        </div>

        <div className="abs chip chip-a" style={{ left: px(26), top: px(65), width: px(224), height: px(78) }}>
          <div className="chip-sym"><Icon n="arrow-down-left" w={20} /></div>
          <div className="chip-text"><span className="chip-title">Collect payments</span><span className="chip-sub">UPI · Virtual accounts</span></div>
        </div>
        <div className="abs chip chip-b" style={{ left: px(26), top: px(252), width: px(224), height: px(78) }}>
          <div className="chip-sym"><Icon n="arrow-up-right-card" w={20} /></div>
          <div className="chip-text"><span className="chip-title">Move money</span><span className="chip-sub">IMPS · NEFT · RTGS</span></div>
        </div>
        <div className="abs chip chip-c" style={{ left: px(1000), top: px(65), width: px(224), height: px(78) }}>
          <div className="chip-sym"><Icon n="landmark" w={20} /></div>
          <div className="chip-text"><span className="chip-title">Connect accounts</span><span className="chip-sub">Open banking APIs</span></div>
        </div>
        <div className="abs chip webhook chip-d" style={{ left: px(978), top: px(240), width: px(280), height: px(133) }}>
          <div className="webhook-head mono"><span>payout.processed</span><Icon n="circle-check" w={17} /></div>
          <p className="webhook-amt">₹25,000.00</p>
          <p className="webhook-foot mono">{"200 OK  ·  Webhook delivered"}</p>
        </div>
        <div className="abs chip label mono" style={{ left: px(483), top: px(373), width: px(290), height: px(40), padding: `0 ${px(16)}` }}>
          <Icon n="code-xml" w={16} />
          One integration. More potential.
        </div>
      </div>

      <div className="principles">
        {principles.map((p, i) => (
          <PrincipleGroup key={p.text} i={i} icon={p.icon} text={p.text} last={i === principles.length - 1} />
        ))}
      </div>
    </section>
  );
}

function PrincipleGroup({ i, icon, text, last }: { i: number; icon: string; text: string; last: boolean }) {
  return (
    <>
      <div className={`principle p${i + 1}`}>
        <Icon n={icon} w={20} />
        {text}
      </div>
      {!last && (
        <div className="vline" aria-hidden="true">
          <Icon n="divider" w={42} h={1} />
        </div>
      )}
    </>
  );
}
