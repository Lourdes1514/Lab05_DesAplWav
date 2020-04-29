const http = require("http");
const url = require("url");
const fs = require('fs')

const server = http.createServer((req, res) => {
  let parsedURL = url.parse(req.url, true);
  let path = parsedURL.pathname;
  path = path.replace(/^\/+|\/+$/g, "");
  console.log(path);
  let qs = parsedURL.query;
  let headers = req.headers;
  let method = req.method.toLowerCase();

  req.on("data",() => {
    console.log("got some data");
  });
  req.on("end", () => {
    console.log("send a response");
    let route =
      typeof routes[path] !== "undefined" ? routes[path] : routes["notFound"];
    let data = {
      path: path,
      queryString: qs,
      headers: headers,
      method: method
    };
    route(data, res);
  });
});

// routes functions

let routes = {
  '': (data, res) => {
    fs.readFile('./index.html',(err, content) => {
      if (err) {
        res.writeHead(404, { "Content-type": "text/html" });
        res.end("<h1>No such image</h1>");
      } else {
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200);
        res.write(content);
        res.end("\n");
      }
    });
  },
  imagen: (data, res) => {
    fs.readFile(__dirname + '/imagen.jpg', (err, image) => {
    if (err) throw err; 
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(image); 
    })
  },
  confirmacion: (data, res) => {
    console.log(data.method)
    if(data.method !== 'post'){
      res.writeHead(500, { "Content-type": "image/x-icon" });
      res.write(`/${data.path}  not found`)
      res.end("\n");
    }else{                                          
      res.writeHead(200);
      res.write('muy pronto nos pondremos en contacto');
      res.end("\n");
    }
  },
  favicon: (data, res) => {
    fs.readFile(__dirname + '/favicon.ico', (err, icon) => {
      if (err) throw err; 
      res.writeHead(200, {'Content-Type': 'image/x-icon'});
      res.end(icon); 
    })
  },
  notFound: (data, res) => {
    let payload = {
      message: "File Not Found",
      code: 404
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(404);
    res.write(payloadStr);
    res.end("\n");
  }
};


server.listen(4200, () => {
  console.log("Listening on port 4200");
});