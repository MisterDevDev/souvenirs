const { syncAndSeed, models: {Person, Place, Thing, Souvenir} } = require('./db');
const express = require('express');
const app = express();

app.put('/souvenirs/:id', async(req, res, next)=> {
    try{
        const souvenirs = await Souvenir.create({
                personId: lucy.id,
                placeId: paris.id,
                thingId: bar.id
            })
    } catch(err) {
        next(err)
    }
})

app.get('/', async(req, res, next)=> {
    try{
        const [person, places, things, souvenirs] = await Promise.all([
            Person.findAll(),
            Place.findAll(),
            Thing.findAll(),
            Souvenir.findAll({
                include: [ Person, Place, Thing ]
            }),
        ])
        //const values = (souvenirs[0].dataValues)
        // console.log(test.person.name);
        res.send(`
            <html>
                <head>
                </head>
                <body>
                    <div>
                        <h2>People</h2>
                        <ul>
                            ${person.map( person => `
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
                        <h2>Souvenirs</h2>
                        <ul>
                            ${souvenirs.map( souvenir => `
                            <li>Person name (${souvenir.person.name}), Place ID (${souvenir.place.name}), Thing ID (${souvenir.thing.name})</li>
                            `).join('')}
                        </ul>
                        <form method='POST' action='/souvenirs/'>
                            <select name='personId'>
                                <option>-- select buyer --</option>
                                ${
                                    person.map( person => `
                                    <option ${ person.id === souvenirs.personId ? 'selected="selected"':''}>${ person.name}</option>
                                    `).join('')}
                            </select>
                            <select name='personId'>
                                <option>-- select place --</option>
                                ${
                                    places.map( place => `
                                    <option ${ place.id === souvenirs.placeId ? 'selected="selected"':''}>${ place.name}</option>
                                    `).join('')}
                            </select>
                            <select name='personId'>
                                <option>-- select thingy --</option>
                                ${
                                    things.map( thing => `
                                    <option ${ things.id === souvenirs.thingId ? 'selected="selected"':''}>${ thing.name}</option>
                                    `).join('')}
                            </select>
                            <button>Save</button>
                        </form>
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