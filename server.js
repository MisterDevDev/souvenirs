const { syncAndSeed, models: {Person, Place, Thing, Souvenir} } = require('./db');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({extended: false}));

app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.post('/souvenirs', async(req, res, next)=> {
    try{
        console.log(req.body)
        await Souvenir.create(req.body);
        res.redirect('/')
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
                            ${souvenirs.map(({person, place, thing}) => {
                            return`
                            <li>${person.name} bought ${thing.name} in ${place.name}</li>
                            `}).join('')}
                        </ul>
                        <form method='POST' action='/souvenirs'>
                            <select name='personId'>
                                <option>-- select buyer --</option>
                                ${
                                    person.map( person => {
                                        return `
                                    <option value=${person.id}>${person.name}</option>
                                    `}).join('')}
                            </select>
                            <select name='placeId'>
                                <option>-- select place --</option>
                                ${
                                    places.map( place => {
                                        return `
                                    <option value=${place.id}>${place.name}</option>
                                    `}).join('')}
                            </select>
                            <select name='thingId'>
                                <option>-- select thingy --</option>
                                ${
                                    things.map( thing => {
                                        return `
                                    <option value=${thing.id}>${thing.name}</option>
                                    `}).join('')}
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