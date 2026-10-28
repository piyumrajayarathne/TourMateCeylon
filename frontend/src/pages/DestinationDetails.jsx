import { Link, useParams } from "react-router-dom";

const destinations = [
  {
    slug: "sigiriya",
    name: "Sigiriya",
    region: "Central Province",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sigiriya%2CSri_Lanka.jpg",
    description:
      "Discover the magnificent Lion Rock, an ancient fortress rising above the Sri Lankan jungle. Explore historic gardens, remarkable frescoes and breathtaking views.",
    attractions: [
      "Sigiriya Rock Fortress",
      "Pidurangala Rock",
      "Sigiriya Museum",
      "Water Gardens",
    ],
    bestTime: "January to April",
    duration: "1–2 days",
    travelTip:
      "Start your climb early in the morning to avoid the midday heat. Bring water and comfortable walking shoes.",
  },
  {
    slug: "ella",
    name: "Ella",
    region: "Uva Province",
    image:
      "https://www.tracedirecte.com/media/original_images/pont-9-arcs-ella-sri-lanka.jpg.1920x0_q85.jpg",
    description:
      "Escape to the misty hills of Ella, known for lush tea plantations, scenic railway journeys, mountain views and peaceful nature trails.",
    attractions: [
      "Nine Arch Bridge",
      "Little Adam's Peak",
      "Ella Rock",
      "Ravana Falls",
    ],
    bestTime: "January to March",
    duration: "2–3 days",
    travelTip:
      "Carry a light jacket and check the weather before hiking. Allow extra time for scenic train journeys.",
  },
  {
    slug: "kandy",
    name: "Kandy",
    region: "Central Province",
        image: "/images/kandy.jpg",

    description:
      "Experience Sri Lankan heritage in Kandy, a historic hill city known for sacred sites, cultural performances, gardens and a beautiful lake.",
    attractions: [
      "Temple of the Sacred Tooth Relic",
      "Kandy Lake",
      "Royal Botanical Gardens",
      "Bahirawakanda Buddha Statue",
    ],
    bestTime: "December to April",
    duration: "1–2 days",
    travelTip:
      "Dress modestly when visiting religious sites and check local opening times before travelling.",
  },
  
    {
    slug: "galle-fort",
    name: "Galle",
    region: "Southern Province",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Galle_Fort%2C_Sri_Lanka.JPG",
    description:
      "Wander through historic streets, coastal scenery and charming cafés in Galle, home to the famous Dutch Fort and a rich maritime history.",
    attractions: [
      "Galle Fort",
      "Galle Lighthouse",
      "Dutch Reformed Church",
      "Unawatuna Beach",
    ],
    bestTime: "December to April",
    duration: "1–2 days",
    travelTip:
      "Explore the fort on foot in the late afternoon for a more comfortable walk and beautiful sunset views.",
  },
  {
    slug: "mirissa",
    name: "Mirissa",
    region: "Southern Province",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Mirissa_Sri_lanka.jpg",
    description:
      "Enjoy a relaxed coastal escape with sandy beaches, ocean views, local seafood and opportunities for marine wildlife excursions.",
    attractions: [
      "Mirissa Beach",
      "Coconut Tree Hill",
      "Parrot Rock",
      "Coastal whale-watching excursions",
    ],
    bestTime: "November to April",
    duration: "2–3 days",
    travelTip:
      "Check sea conditions before swimming or booking boat excursions, and choose responsible wildlife operators.",
  },
  {
    slug: "nuwara-eliya",
    name: "Nuwara Eliya",
    region: "Central Province",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nuwara-Eliya.jpg",  
    description:
      "Discover cool mountain air, rolling tea estates, gardens and colonial-era architecture in Sri Lanka's picturesque hill country.",
    attractions: [
      "Gregory Lake",
      "Victoria Park",
      "Tea plantations",
      "Horton Plains National Park",
    ],
    bestTime: "February to April",
    duration: "2–3 days",
    travelTip:
      "Pack warm clothing and check conditions before visiting Horton Plains, particularly for early-morning hikes.",
  },
];

export default function DestinationDetails() {
  const { slug } = useParams();

  const destination = destinations.find(
    (item) => item.slug === slug
  );

  if (!destination) {
    return (
      <main className="destination-details-not-found">
        <h1>Destination not found</h1>
        <p>We couldn't find that destination.</p>
        <Link to="/destinations">
          Back to destinations
        </Link>
      </main>
    );
  }

  return (
    <main className="destination-details-page">
      <div className="destination-details-container">
        <Link
          to="/destinations"
          className="destination-details-back"
        >
          ← Back to destinations
        </Link>

        <article className="destination-details-card">
          <div className="destination-details-image-wrapper">
            <img
              src={destination.image}
              alt={destination.name}
              className="destination-details-image"
            />
            <span className="destination-details-region">
              {destination.region}
            </span>
          </div>

          <div className="destination-details-body">
            <p className="destination-details-eyebrow">
              DISCOVER SRI LANKA
            </p>

            <h1>{destination.name}</h1>

            <p className="destination-details-description">
              {destination.description}
            </p>

            <div className="destination-details-info">
              <div>
                <span>Best time to visit</span>
                <strong>{destination.bestTime}</strong>
              </div>

              <div>
                <span>Suggested duration</span>
                <strong>{destination.duration}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{destination.region}</strong>
              </div>
            </div>

            <section className="destination-attractions">
              <p className="destination-details-eyebrow">
                PLACES TO EXPLORE
              </p>

              <h2>Popular Attractions</h2>

              <ul>
                {destination.attractions.map((attraction) => (
                  <li key={attraction}>{attraction}</li>
                ))}
              </ul>
            </section>

            <section className="destination-travel-tip">
              <h2>Travel Tip</h2>
              <p>{destination.travelTip}</p>
            </section>

            <Link
              to="/my-trips"
              className="destination-plan-button"
            >
              Plan your trip <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
