const writingTopics = [
  "Living in San Francisco",
  "Working at an early-stage company",
  "Things I’m learning",
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="mark" href="#top" aria-label="Ben Bayliss, home">B</a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#writing">Writing</a>
        </nav>
        <a className="menu-circle" href="#writing" aria-label="Go to writing">
          <span />
          <span />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-photo" aria-hidden="true" />
        <p className="hero-label">Personal site / San Francisco</p>
        <h1>Ben<br />Bayliss</h1>
        <p className="hero-intro">I work in tech and live in San Francisco.</p>
        <div className="hero-footer">
          <span>Work</span>
          <span>Writing</span>
          <span>2026</span>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="section-label">
          <span>01.</span>
          <span>About</span>
        </div>
        <div className="section-title">
          <p>Introduction</p>
          <h2>This is my corner<br />of the internet.</h2>
        </div>
        <div className="about-copy">
          <p>
            I work at a technology startup in San Francisco. This site is a
            place for selected work and occasional writing.
          </p>
          <p>That’s the whole pitch.</p>
        </div>
      </section>

      <section className="photo-section" aria-label="San Francisco">
        <img src="/sf-street.jpg" alt="A person walking down a foggy San Francisco street" />
        <span>San Francisco, California</span>
      </section>

      <section className="work section" id="work">
        <div className="section-label">
          <span>02.</span>
          <span>Work</span>
        </div>
        <div className="work-grid">
          <h2>Work</h2>
          <div className="work-copy">
            <p>
              A short, selective record of the work I’m proud of will live
              here. No exhaustive résumé.
            </p>
            <span>Details to add</span>
          </div>
        </div>
      </section>

      <section className="writing section" id="writing">
        <div className="section-label">
          <span>03.</span>
          <span>Writing</span>
        </div>
        <div className="writing-intro">
          <p>Notes</p>
          <h2>San Francisco<br />and startup work.</h2>
          <p className="writing-description">
            Published without company names, customer details, or private
            conversations.
          </p>
        </div>
        <div className="topic-list">
          {writingTopics.map((topic, index) => (
            <div className="topic" key={topic}>
              <span>0{index + 1}</span>
              <h3>{topic}</h3>
              <span>Coming soon</span>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>Ben Bayliss</p>
        <p>San Francisco, CA</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
