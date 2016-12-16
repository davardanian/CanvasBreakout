/**
 * Created by user on 15-Dec-16.
 */
// BASIC SERVER DECLARATION
'use strict';
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

// LIST OF SCORES
let scores = [
    {name: 'Muk', score: 100},
    {name: 'Kria', score: 12},
    {name: 'Mane', score: 3233},
    {name: 'Marat', score: 200},
    {name: 'Hakob', score: 3123}

];


// BASIC SERVER FUNCTIONS DECLARATION
const httpServer = http.createServer(function(req, res) {

    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;

    fs.readFile('./' + req.url, function (err, data) {
        if (err) {
            res.statusCode = 404;
            res.end("<h1 style='text-align: center'>File Not Found</h1>")
        }
        res.statusCode = 200;
        res.end(data);
    });

    // SENDING THE LIST TO CLIENT
    if (method === 'GET') {
        if (req.url === '/index') {

            const json = JSON.stringify(scores);
            res.setHeader('Content-Type', 'application/json');
            res.end(json);
        }
    }

    if(method === 'POST') {
        if (req.url === ('/index')) {

            // read the content of the message
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);  // now that we have the content, convert the JSON into an object
                scores.push(jsonObj);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(jsonObj));

            });

        }
    }

});
    httpServer.listen(666);

