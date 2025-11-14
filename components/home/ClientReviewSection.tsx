import { Star, StarHalf } from 'lucide-react'; // Icônes pour les étoiles


const reviews = [
  {
    name: 'Karim Alaoui',
    rating: 5,
    review: "De loin le meilleur barbier de Rabat. L'équipe est pro, l'ambiance est top et ma coupe est toujours parfaite. Je recommande à 100% !",
  },
  {
    name: 'Mehdi Bennani',
    rating: 5,
    review: "Je viens pour la taille de ma barbe et je ne suis jamais déçu. Youssef est un véritable artiste. Le salon est impeccable et moderne.",
  },
  {
    name: 'Amine Cherkaoui',
    rating: 4.5,
    review: "Super expérience ! J'ai testé le soin du visage en plus de ma coupe, c'était très relaxant. Un vrai moment de détente.",
  },
];

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<Star key={i} className="text-gold fill-gold" />);
        } else if (i - 0.5 === rating) {
            stars.push(<StarHalf key={i} className="text-gold fill-gold" />);
        } else {
            stars.push(<Star key={i} className="text-gold" />);
        }
    }
    return <div className="flex">{stars}</div>;
};


export default function ClientReviewsSection() {
  return (
    <section className="bg-anthracite py-16 md:py-24">
      <div className="container mx-auto px-4">
        
        {/* Titre de la section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">Ce que nos clients disent</h2>
          <p className="mt-4 text-white/70">
            Votre satisfaction est notre plus grande fierté. Découvrez les avis de ceux qui nous font confiance.
          </p>
        </div>

        {/* Grille des avis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-black rounded-lg p-8 flex flex-col border border-anthracite-dark shadow-lg">
              <div className="flex items-center mb-4">
                {renderStars(review.rating)}
              </div>
              <p className="text-white/80 italic flex-grow mb-6">"{review.review}"</p>
              <p className="font-bold text-gold text-right">- {review.name}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}