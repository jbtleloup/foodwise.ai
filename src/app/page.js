export default function Home() {
  return (
    <main className="main__restaurant">
      <section className="hero">
        <div className="hero-content">
          <h1>Effortless Calorie Tracking with AI</h1>
          <p>
            Snap a pic, know your intake. Foodwise.ai uses advanced image
            recognition to estimate the calories in your meals.
          </p>
          <br></br>
          <p>
            <strong>Sign in to get started</strong>
          </p>
        </div>
        <div className="hero-image">
          <img src="foodwise-home.png" alt="Foodwise AI" />
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <img src="price.svg" alt="Camera Icon" />
          <h3>Snap & Analyze</h3>
          <p>
            Simply take a picture of your meal, and our AI will analyze it to
            provide a calorie estimate.
          </p>
        </div>
        <div className="feature">
          <img src="price.svg" alt="Tracking Icon" />
          <h3>Track Your Progress</h3>
          <p>
            Monitor your daily calorie intake and track your progress towards
            your health goals.
          </p>
        </div>
        <div className="feature">
          <img src="price.svg" alt="Insights Icon" />
          <h3>Gain Insights</h3>
          <p>
            Receive personalized insights and recommendations to help you make
            informed food choices.
          </p>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>
            "Foodwise.ai has made tracking my calories so much easier! I love
            the convenience of just snapping a photo." - John Doe
          </p>
        </div>
        <div className="testimonial">
          <p>
            "This app has helped me become more mindful of my eating habits. The
            AI is surprisingly accurate!" - Jane Smith
          </p>
        </div>
      </section>
    </main>
  );
}
