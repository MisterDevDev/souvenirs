const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const { DataTypes } = Sequelize;

const db = new Sequelize('postgres://localhost:5432/souvenirs', {logging: false});

const Person = db.define('person', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    },
})
const Place = db.define('place', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
})
const Thing = db.define('thing', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
})

const Souvenir = db.define('souvenir', {});

Souvenir.belongsTo(Person);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);
Person.hasMany(Souvenir);
Place.hasMany(Souvenir);
Thing.hasMany(Souvenir);

const data = {
    people: ['moe', 'larry', 'lucy', 'ethyl'],
    places: ['paris', 'nyc', 'chicago', 'london'],
    things: ['foo', 'bar', 'bazz', 'quq']
  };

const syncAndSeed = async()=> {
    await db.sync({ force: true });
    const [moe, larry, lucy, ethyl] = await Promise.all(
        data.people.map( name => Person.create({name}))
    );
    const [paris, nyc, chicago, london] = await Promise.all(
        data.places.map( name => Place.create({name}))
    );
    const [foo, bar, bazz, quq] = await Promise.all(
        data.things.map( name => Thing.create({name}))
    );
    await Promise.all([
        Souvenir.create({
            personId: lucy.id,
            placeId: paris.id,
            thingId: quq.id
        })
    ])
    console.log('Sync and Seed operation complete')
}

//syncAndSeed();


module.exports = {
    syncAndSeed,
    models: {
        Person,
        Place,
        Thing,
        Souvenir
    }
};
