require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('./models/Trip');

// Dati per generare viaggi casuali
const types = ['Natura', 'Avventura', 'Relax'];
const destinations = [
  {
    location: 'Budapest',
    title: 'Relax a Budapest',
    description: 'Rilassati tra terme storiche e l’atmosfera romantica del Danubio.',
    budget: 800,
    type: 'Relax',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    temperature: { max: 30, min: 10 },
    costOfLiving: 60,
    duration: 5,
    season: 'Primavera',
    recommendedActivities: ['Terme Széchenyi', 'Crociera sul Danubio', 'Passeggiata a Buda'],
    rating: 4.5,
    isSurprise: true
  },
  {
    location: 'Alpi Italiane',
    title: 'Avventura nelle Alpi Italiane',
    description: 'Scopri emozionanti sentieri e panorami mozzafiato tra le montagne.',
    budget: 1200,
    type: 'Avventura',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    temperature: { max: 15, min: -5 },
    costOfLiving: 70,
    duration: 7,
    season: 'Inverno',
    recommendedActivities: ['Sci', 'Escursionismo', 'Arrampicata'],
    rating: 4.7,
    isSurprise: false
  },
  {
    location: 'Costiera Amalfitana',
    title: 'Relax in Costiera Amalfitana',
    description: 'Goditi il sole, il mare cristallino e la cucina mediterranea.',
    budget: 1500,
    type: 'Relax',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
    temperature: { max: 28, min: 18 },
    costOfLiving: 80,
    duration: 6,
    season: 'Estate',
    recommendedActivities: ['Spiagge', 'Escursioni in barca', 'Visita a Positano'],
    rating: 4.8,
    isSurprise: false
  },
  {
    location: 'Safari in Tanzania',
    title: 'Avventura Safari in Tanzania',
    description: 'Vivi un’esperienza unica tra animali selvaggi e paesaggi africani.',
    budget: 1800,
    type: 'Avventura',
    image: 'https://images.unsplash.com/photo-1501706362039-c06b2d715385',
    temperature: { max: 35, min: 20 },
    costOfLiving: 50,
    duration: 8,
    season: 'Primavera',
    recommendedActivities: ['Safari', 'Fotografia', 'Visita ai parchi nazionali'],
    rating: 4.9,
    isSurprise: true
  },
  {
    location: 'Isole Maldive',
    title: 'Relax alle Isole Maldive',
    description: 'Paradiso tropicale con spiagge di sabbia bianca e acque cristalline.',
    budget: 2000,
    type: 'Relax',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af',
    temperature: { max: 32, min: 25 },
    costOfLiving: 90,
    duration: 7,
    season: 'Inverno',
    recommendedActivities: ['Snorkeling', 'Relax in spiaggia', 'Spa'],
    rating: 4.9,
    isSurprise: false
  },
  {
    location: 'Fiordi Norvegesi',
    title: 'Natura nei Fiordi Norvegesi',
    description: 'Esplora paesaggi spettacolari tra montagne e acque profonde.',
    budget: 1600,
    type: 'Natura',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
    temperature: { max: 20, min: 5 },
    costOfLiving: 85,
    duration: 6,
    season: 'Estate',
    recommendedActivities: ['Crociera', 'Escursionismo', 'Fotografia'],
    rating: 4.6,
    isSurprise: true
  },
  {
    location: 'Toscana',
    title: 'Relax in Toscana',
    description: 'Vivi la dolce vita tra vigneti, arte e buon cibo.',
    budget: 1000,
    type: 'Relax',
    image: 'https://images.unsplash.com/photo-1494783367193-149034010e31',
    temperature: { max: 27, min: 12 },
    costOfLiving: 65,
    duration: 5,
    season: 'Autunno',
    recommendedActivities: ['Degustazione vini', 'Visita a Firenze', 'Passeggiate in campagna'],
    rating: 4.7,
    isSurprise: false
  },
  {
    location: 'Patagonia',
    title: 'Avventura in Patagonia',
    description: 'Scopri terre selvagge e paesaggi incontaminati.',
    budget: 1700,
    type: 'Avventura',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    temperature: { max: 18, min: 0 },
    costOfLiving: 55,
    duration: 9,
    season: 'Primavera',
    recommendedActivities: ['Trekking', 'Kayak', 'Osservazione fauna'],
    rating: 4.8,
    isSurprise: true
  },
  {
    location: 'Gran Canyon',
    title: 'Natura al Gran Canyon',
    description: 'Ammira uno dei paesaggi più iconici del mondo.',
    budget: 1300,
    type: 'Natura',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    temperature: { max: 35, min: 15 },
    costOfLiving: 70,
    duration: 4,
    season: 'Estate',
    recommendedActivities: ['Escursionismo', 'Fotografia', 'Tour in elicottero'],
    rating: 4.7,
    isSurprise: false
  },
  {
    location: 'Bali',
    title: 'Relax a Bali',
    description: 'Spiagge, cultura e spiritualità in un’isola paradisiaca.',
    budget: 1400,
    type: 'Relax',
    image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0',
    temperature: { max: 31, min: 24 },
    costOfLiving: 50,
    duration: 7,
    season: 'Inverno',
    recommendedActivities: ['Yoga', 'Surf', 'Visita ai templi'],
    rating: 4.8,
    isSurprise: true
  }
];



// Funzione principale di seeding
const seedDatabase = async () => {
  try {
    // Connessione a MongoDB
    await mongoose.connect(`${process.env.MONGODB_URL}${process.env.DB_NAME}`, {
     
    });
    console.log('Connesso a MongoDB');

    // Elimina i viaggi esistenti (opzionale)
    await Trip.deleteMany({});
    console.log('Collezione trips svuotata');

    // Genera 50 viaggi

    // Inserisci i viaggi presenti nell'array destinations
    await Trip.insertMany(destinations);
    console.log('Viaggi inseriti nel database');

    // Chiudi la connessione
    await mongoose.connection.close();
    console.log('Connessione a MongoDB chiusa');
  } catch (err) {
    console.error('Errore durante il seeding:', err);
    process.exit(1);
  }
};

// Esegui il seeding
seedDatabase();