const express = require('express');
require('dotenv').config();

class Server {

    constructor() {
        this.app = express();
    }

    start( callback ) {
        this.app.listen(process.env.PORT || 8000, callback);
    }
    
}

module.exports = Server;