var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

const templeteHTML = (title, $fileList, body)=> {
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB2 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB2222</a></h1>
      ${$fileList}
      <a href="/create">create</a>
      ${body}
      
    </body>
    </html>
  `;
};

const templeteList = (files)=> {

  var $fileList = "<ol>";
  
  for(var i=0; i<files.length; i++) {
    $fileList = $fileList + `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
  }

  $fileList = $fileList + "</ol>";
  return $fileList;
}


var app = http.createServer((request, response)=> {
  var _url = request.url;
  var pathName = url.parse(_url, true).pathname;
  var queryData = url.parse(_url, true).query;
  var title = queryData.id;
  
  const resHTML = (pTitle, pDescription)=> {
    fs.readdir('./data', 'utf8', (err, files)=> {
      var templete = templeteHTML(pTitle, templeteList(files), `<h2>${pTitle}</h2>${pDescription}`);
        response.writeHead(200);
        response.end(templete);
    });
  }
  console.log(pathName);
  if(pathName === '/') {
    
    if(!queryData.id) {
      resHTML('Welcome', 'Hello, nodejs');
    }else {
      fs.readFile('./data/' + queryData.id, 'utf8', (err, description)=> {
        resHTML(title, description);
      });
    }
  }else if(pathName === '/create') {
    var $formHTML = `
      <form action="http://localhost:3000/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"/></p>
        <p><textarea name="description" placeholder="description"></textarea>
        <p><input type="submit"/></p>
      </form>
    `;
    resHTML('WEB - create', $formHTML);
  }else if(pathName === '/create_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
    });
    response.writeHead(200);
    response.end('Success');
  }else {
    
    response.writeHead(404);
    response.end('Not found');
  }
  
  

});
app.listen(3000);