const { syncAndSeed, models: {People, Place, Thing, Souvenir} } = require('./db');
const express = require('express');
const app = express();

app.get('/', async(req, res, next)=> {
    try{
        const [people, places, things, souvenirs] = await Promise.all([
            People.findAll(),
            Place.findAll(),
            Thing.findAll(),
            Souvenir.findAll({
                include: [ People, Place, Thing ]
            }),
        ])

        res.send(`
            <html>
                <head>
                </head>
                <body>
                    <div>
                        <h2>People</h2>
                        <ul>
                            ${people.map( person => `
                            <li>${person.name}</li>
                            `).join('')}
                        </ul>
                        <h2>Places</h2>
                        <ul>
                            ${places.map( place => `
                            <li>${place.name}</li>
                            `).join('')}
                        </ul>
                        <h2>Things</h2>
                        <ul>
                            ${things.map( thing => `
                            <li>${thing.name}</li>
                            `).join('')}
                        </ul>
                        <h2>Souvenirs (cause Evee wanted it)</h2>
                        <ul>
                            ${souvenirs.map( souvenir => `
                            <li>Person ID = ${people.name}, Place ID = ${souvenir.personId}, Thing ID = ${souvenir.thingId}</li>
                            `).join('')}
                        </ul>
                    </div>
                </body>
            </html>
        `)
    } catch(err) {
        next(err);
    }
})

const init = async()=> {
    try{
        await syncAndSeed()
        const port = 1337;
        app.listen(port, ()=> console.log(`Listening on port ${port}`));

    } catch(err) {
        console.log(err);
    }
}

init();