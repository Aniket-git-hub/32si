import express from 'express';
const router = express.Router();

interface City {
  name: string;
  // other properties...
}

const cities: City[] = require('cities.json');

router.get('/city/:name', (req, res) => {
  const name = req.params.name;
  const matches = cities.filter((city: City) => city.name.toLowerCase().startsWith(name.toLowerCase()));
  if (matches) {
    res.json(matches);
  } else {
    res.status(404).json({ error: 'City not found' });
  }
});

export default router;
