import express from "express";
const router = express.Router()

// import cities from 'cities.json' assert { type: 'json' };

// router.get('/city/:name', (req, res) => {

//     const name = req.params.name
    
//     const matches = cities.filter(city => city.name.toLowerCase().startsWith(name.toLowerCase()));
//     if (matches) {
//         res.json(matches);
//     } else {
//         res.status(404).json({ error: 'City not found' });
//     }
// });

export default router