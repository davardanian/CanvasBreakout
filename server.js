
// BASIC SERVER DECLARATION
'use strict';
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
var list = require('./list.json');






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


            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(list));
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
                list.push(jsonObj);
                console.log(list);

                let b = JSON.stringify(list);
                console.log(b);

                fs.writeFile("./list.json", b, function(err){
                    if (err) throw err;
                    console.log("success");
                });
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(jsonObj));

            });

        }
    }

});
httpServer.listen(666);

