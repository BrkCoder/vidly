const genres = require('./routes/genres');
const express = require('express');
const app = express();

// use middleware in the request pipeline
app.use(express.json());
app.use('/api/genres', genres);

app.get('/', (req, res) => {
    const docs = getRestApiDocs();
    res.send(`Welcome to Vidly App! <br><br> **************** Public API of Vidly **************** <br><br> ${docs}`);
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

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