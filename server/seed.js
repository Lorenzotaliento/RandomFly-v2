require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('./models/Trip');

// Dati per generare viaggi casuali
const types = ['Natura', 'Avventura', 'Relax'];
const destinations = [
  'Alpi Italiane', 'Costiera Amalfitana', 'Safari in Tanzania', 'Isole Maldive', 'Fiordi Norvegesi',
  'Toscana', 'Patagonia', 'Gran Canyon', 'Bali', 'Islanda', 'Amazzonia', 'Kyoto', 'Santorini',
  'Yosemite', 'Himalaya', 'Barriera Corallina', 'Provenza', 'Cappadocia', 'Banff', 'Machu Picchu',
  'Sahara', 'Lago di Garda', 'Dolomiti', 'Ibiza', 'Nuova Zelanda', 'Marocco', 'Scozia',
  'Costa Rica', 'Giappone', 'Seychelles', 'Groenlandia', 'Andalusia', 'Yellowstone', 'Parigi',
  'Venezia', 'Rio de Janeiro', 'Hawaii', 'Lapponia', 'Sicilia', 'Kerala', 'Atene', 'Praga',
  'Budapest', 'Croazia', 'Namibia', 'Perù', 'Vietnam', 'Tailandia', 'California', 'Alaska'
];
const descriptions = [
  'Un’esperienza immersiva tra paesaggi mozzafiato.',
  'Esplora la bellezza selvaggia di questa destinazione.',
  'Goditi un relax totale in un paradiso naturale.',
  'Avventura e adrenalina in un ambiente unico.',
  'Scopri la cultura locale e i sapori autentici.',
  'Un viaggio perfetto per gli amanti della natura.',
  'Vivi un’esperienza indimenticabile tra mare e montagna.',
  'Rilassati in un’oasi di pace e tranquillità.',
  'Trekking e panorami spettacolari ti aspettano.',
  'Un’immersione nella storia e nella tradizione.'
];
const images = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801',
  'https://images.unsplash.com/photo-1501706362039-c06b2d715385',
  'https://images.unsplash.com/photo-1516550893923-42d28e5677af',
  'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
  'https://images.unsplash.com/photo-1494783367193-149034010e31',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0',
  'https://images.unsplash.com/photo-1499364615650-ec38552f4f34'
];

// Funzione per generare un viaggio casuale
const generateRandomTrip = () => {
  const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomBudget = Math.floor(Math.random() * (2000 - 300 + 1)) + 300; // Budget tra 300 e 2000
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return {
    title: `${randomType} a ${randomDestination}`,
    description: randomDescription,
    budget: randomBudget,
    type: randomType,
    image: randomImage,
  };
};

// Funzione principale di seeding
const seedDatabase = async () => {
  try {
    // Connessione a MongoDB
    await mongoose.connect(`${process.env.MONGODB_URL}${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connesso a MongoDB');

    // Elimina i viaggi esistenti (opzionale)
    await Trip.deleteMany({});
    console.log('Collezione trips svuotata');

    // Genera 50 viaggi
    const trips = Array.from({ length: 50 }, generateRandomTrip);
    await Trip.insertMany(trips);
    console.log('Inseriti 50 viaggi con successo');

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