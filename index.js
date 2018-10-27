const uuidv4 = require('uuid/v4');
const Joi = require('joi');
const express = require('express');
const app = express();

// use middleware in the request pipeline
app.use(express.json());

const genres = [
    {
        id: uuidv4(),
        name: 'Action'
    },
    {
        id: uuidv4(),
        name: 'Adventure'
    },
    {
        id: uuidv4(),
        name: 'Comedies'
    },
    {
        id: uuidv4(),
        name: 'War'
    },
    {
        id: uuidv4(),
        name: 'Westerns'
    }
]

app.get('/', (req, res) => {
    const docs = getRestApiDocs();
    res.send(`Welcome to Vidly App! <br><br> **************** Public API of Vidly **************** <br><br> ${docs}`);
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

/**
 * Define Public API of Vidly.
 **/

/** 
 * Get all Genres.
 **/
app.get('/api/genres', (req, res) => {
    res.send(genres);
});

/** 
 * Get specific genre by id.
 **/
app.get('/api/genres/:id', (req, res) => {
    //Look up the genre , If not exist, return Not Found(404)
    const genre = genres.find((g) => g.id === req.params.id);
    if (!genre) { // 404
        return res.status(404).send(`The genre with give id:${req.params.id} was not found!`);
    }

    // send genre
    res.send(genre);
});

/** 
 * Create new genre object.
 **/
app.post('/api/genres', (req, res) => {
    //Entity is invalid, send Bad Request(400)
    const { error } = validateEntity(req.body);
    if (error) {
        return res.status(400).send(error.details.map(function (d) {
            return d.message;
        }).join(", "));

    }

    //Create new genre
    const genre = {
        id: uuidv4(),
        name: req.body.name
    }
    genres.push(genre);

    //Send new genre
    res.send(genre);
});

/**  
 * Update existing genre object.
 **/
app.put('/api/genres/:id', (req, res) => {
    //Look up the genre , If not exist, return Not Found(404)
    const genre = genres.find((g) => g.id === req.params.id);
    if (!genre) { // 404
        return res.status(404).send(`The genre with give id:${req.params.id} was not found!`);
    }

    //Entity is invalid, send Bad Request(400)
    const { error } = validateEntity(req.body);
    if (error) {
        return res.status(400).send(error.details.map(function (d) {
            return d.message;
        }).join(", "));

    }

    //Update genre
    genre.name = req.body.name;

    //Return updated Entity
    res.send(genre);
});

/**  
 * Delete existing genre object.
 **/
app.delete('/api/genres/:id', (req, res) => {

    //Look up the genre , If not exist, return Not Found(404)
    const genre = genres.find((g) => g.id === req.params.id);
    if (!genre) { // 404
        return res.status(404).send(`The genre with give id:${req.params.id} was not found!`);
    }

    // Delete
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    //Return the same genre
    res.send(genre);
});

/** 
 * Utils
 **/

/**
 * Validate genre entity by specific schema.
 * @param {*} genre
 * @returns
 */
function validateEntity(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema);
}

/**
 *
 * Create Rest API Slim Docs for user display 
 * @returns
 */
function getRestApiDocs() {

    const listOfEndPoints = app._router.stack.filter((r, index) => r.route && index).map(r => { return { route: r.route.path, method: Object.keys(r.route.methods).shift() } });

    const docs = listOfEndPoints.map((point, index) => {
        return `${index + 1}. ${point.method.toUpperCase()} Method url: ${point.route} <br>`;
    }).join(" ");

    return docs;
}
/** 
 * Initiliaze server.
 **/
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));;