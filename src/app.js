const Server = require('./api/util/server');
const mongoose = require('mongoose');

const postRoutes = require("./api/components/posts/posts.routes");

const bodyParser = require("body-parser");
const cors = require('cors');    
require('dotenv').config();

const server = new Server();

//Body Parser
server.app.use( bodyParser.urlencoded({ extended: true}));
server.app.use( bodyParser.json() );

//Server Routes
server.app.use(`/${process.env.NAME}/posts`, postRoutes);

//CORS Config
server.app.use(cors({ origin: true, credentials: true }));

//Mongo
mongoose.connect(process.env.DATABASE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) throw err;
        console.log('Database UP!')
    });

//Express up
server.start(() => {
    var port = process.env.PORT || 8000;
    console.log(`Running on ${port}`);
});