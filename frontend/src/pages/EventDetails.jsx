import { Link, useParams } from "react-router-dom";

const events = [
  {
    id: 1,
    name: "Kandy Esala Perahera",
    category: "Cultural",
    date: "2027-07-25",
    location: "Kandy",
    description:
      "Experience Sri Lanka's Festival of the Tooth, featuring traditional dancers, drummers, and a magnificent procession honouring the Sacred Tooth Relic of the Buddha.",
    image:
      "https://www.consciousjourneys.com/wp-content/uploads/2016/03/esala-6.jpg",
    
  },
  {
    id: 2,
    name: "Galle Literary Festival",
    category: "Arts",
    date: "2027-01-15",
    location: "Galle",
    description:
      "Discover literature, creative conversations, poetry, and cultural experiences in historic Galle.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQawws0r-AQf-J48Jxot5wQK0v6cx3HpRaV8_AbmoVt2BhjFH9BScTHHm0&s=10https://commons.wikimedia.org/wiki/Special:FilePath/Galle_Fort%2C_Sri_Lanka.JPG",
  },
  {
    id: 3,
    name: "Vesak Festival",
    category: "Religious",
    date: "2027-05-20",
    location: "Colombo",
    description:
      "Explore Vesak lanterns, illuminated decorations, and Buddhist cultural traditions celebrating the life and teachings of the Buddha.",
    image:
      "https://ik.imagekit.io/TBR/Island%20Events/Vesak%20Festival%20Sri%20lanka.webp",
    
  },
  {
    id: 4,
    name: "Surfing in Arugam Bay",
    category: "Adventure",
    date: "2027-06-10",
    location: "Arugam Bay",
    description:
      "Enjoy beautiful beaches, coastal scenery, and surfing opportunities at one of Sri Lanka's well-known surfing destinations.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Arugam_Bay.jpg",
    
  },
  {
    id: 5,
    name: "Nuwara Eliya Season",
    category: "Nature",
    date: "2027-04-10",
    location: "Nuwara Eliya",
    description:
      "Explore the cool highlands, gardens, tea estates, and attractions of Nuwara Eliya during the hill-country season.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nuwara-Eliya.jpg",
    
  },
  {
    id: 6,
    name: "Sinhala and Tamil New Year",
    category: "Cultural",
    date: "2027-04-14",
    location: "Sri Lanka",
    description:
      "Celebrate the Sinhala and Tamil New Year with traditional games, festive foods, family gatherings, and cultural customs shared across Sri Lanka.",
    image:
      "https://media.istockphoto.com/id/1211758008/photo/shallow-focused-side-view-of-milk-rice-a-sinhala-tamil-new-year-avurudu-festival-food.jpg?s=612x612&w=0&k=20&c=6uWYT5riClJ-aVIyHha-XILM3d2cLaHyQ_TIfo-_srQ=",
   
  },
];

export default function EventDetails() {
  const { id } = useParams();
  const event = events.find((item) => item.id === Number(id));

  if (!event) {
    return (
      <main className="events-page">
        <section className="events-content">
          <h1>Event not found</h1>
          <p>Sorry, we couldn't find this event.</p>
          <Link to="/events" className="event-link">
            ← Back to events
          </Link>
        </section>
      </main>
    );
  }

  const formattedDate = new Date(
    `${event.date}T12:00:00`
  ).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="events-page">
      <section className="event-details">
        <Link to="/events" className="event-details-back">
          ← Back to all events
        </Link>

        <div className="event-details-card">
          <img
            className="event-details-image"
            src={event.image}
            alt={event.name}
          />

          <div className="event-details-body">
            <span className="event-category">
              {event.category}
            </span>

            <p className="events-section-eyebrow">
              DISCOVER SRI LANKA
            </p>

            <h1>{event.name}</h1>

            <p className="event-details-description">
              {event.description}
            </p>

            <div className="event-details-info">
              <p>
                <strong>Date:</strong> {formattedDate}
              </p>
              <p>
                <strong>Location:</strong> {event.location}, Sri Lanka
              </p>
              <p>
                <strong>Category:</strong> {event.category}
              </p>
            </div>

            <div>
              <Link to="/my-trips" className="event-link">
                Plan your trip →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
