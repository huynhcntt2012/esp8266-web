const https = require('https');
var fs = require('fs');
var url = require('url');
var http = require('http');
var querystring = require('querystring');
var crypto = require('crypto');
function requestHandler(request, response) {
    switch (request.url) {
        case "/update":
            var uriData = url.parse(request.url);
            var pathname = uriData.pathname; // /firmware.bin
            if (pathname == '/firmware.bin') {
                var ver = request.headers['x-esp8266-version'];
                //console.log(request);
                console.log('Client request update, version ', ver);
                if (ver == '2.0') {
                    console.log('Send firmware ' + ver + 'to client');
                    fs.readFile('./esp8266-firmware-2.0.bin', function(error, content) {
                        response.writeHead(200, {
                            'Content-Type': 'binary/octet-stream',
                            'Content-Length': Buffer.byteLength(content),
                            'x-MD5': crypto.createHash('md5').update(content).digest("hex")
                        });
                        response.end(content);
                    });
                } else {
                    response.statusCode = 304;
                    response.end();
                }
            }
            break;
        case "/index":
            response.end(`<html><body><h1>Esp8266</h1></body></html>`);
            break;
        default:
            response.writeHead(404);
            response.end(JSON.stringify({error:"Resource not found"}));

    }
}
var server = http.createServer(requestHandler);
server.listen(3000, '0.0.0.0');
console.log('Server listening on port 3000');
