

const uuidv4 = require('uuid/v4');
const Joi = require('joi');
const router = require('express').Router();

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

/**
 * Define Public API of Vidly.
 **/

/** 
 * Get all Genres.
 **/
router.get('/', (req, res) => {
    res.send(genres);
});

/** 
 * Get specific genre by id.
 **/
router.get('/:id', (req, res) => {
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
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {

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

module.exports = router;