// load libraries
const express = require ('express')
const handlebars = require ('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default


// configure the environment
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;
const API_KEY = process.env.API_KEY || '';
const GIPHY_URL = 'https://api.giphy.com/v1/gifs/search'


// create an instance of express 
const app = express();


// configure handlebars
app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}));
app.set('view engine', 'hbs');


// configure app
app.get('/', (req,res) => {
    res.status(200);
    res.type('text/html');
    res.render('home');
});

app.get('/result', async (req,res) => {

    const search = req.query['searchText'];
    const limit = req.query['searchLimit'];
    console.log(`Search term is: ${search}`)

    const url = withQuery (
        GIPHY_URL,
        {
            api_key: API_KEY,
            q: search,
            limit: limit
        }
    )
    const result = await fetch(url);
    const giphys = await result.json();
    console.log(`List of images extracted: `,giphys);

    let imgList = giphys.data.map(result => result.images.fixed_height.url);
    console.log(`List of images to be shown: `,imgList);

    res.status(200);
    res.type('text/html');
    res.render('result',{search, limit, imgList});
})


// load or mount static files
app.use(express.static(__dirname + '/public'));

app.use((req,res) => {
    res.redirect('/');
})


// start express
if (API_KEY) {
    app.listen(PORT, () => {
        console.log(`Application started at PORT: ${PORT} at ${new Date()}`);
    })
} else {
    console.error('API_KEY is not set');
}