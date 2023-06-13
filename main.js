var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');

var template = require('./lib/template.js');

var app = http.createServer((request, response)=> {
  var _url = request.url;
  var pathName = url.parse(_url, true).pathname;
  var queryData = url.parse(_url, true).query;
  var title = queryData.id;
  var $create = `<a href="/create">create</a>`;
  var $update = `<a href="/update?id=${title}">update</a>`;
  var $delete = `
    <form action="/delete_process" method="post">
      <input type="hidden" name="id" value="${title}"/>
      <input type="submit" value="delete"/>
    </form>
  `;
  
  const resHTML = (title, pCrTemp, pUpTemp, pDelTemp, pDescription)=> {
    fs.readdir('./data', 'utf8', (err, files)=> {
      // var filteredId = path.parse(queryData.id).base;
      var filteredId = path.parse(!queryData.id?'':queryData.id).base;
      fs.readFile('./data/' + filteredId, 'utf8', (err, description)=> {
        var html = template.html(title, template.list(files), pCrTemp, pUpTemp, pDelTemp, `<h2>${title}</h2>${!pDescription?description:pDescription}`);
        response.writeHead(200);
        response.end(html);
      });
    });
  }
  console.log(pathName);
  if(pathName === '/') {
    
    if(!queryData.id) {
      resHTML('Welcome', $create, '', '', 'Hello, nodejs');
    }else {
      resHTML(title, $create, $update, $delete);
    }
  }else if(pathName === '/create') {
    var $formHTML = `
      <form action="http://localhost:3000/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"/></p>
        <p><textarea name="description" placeholder="description"></textarea>
        <p><input type="submit"/></p>
      </form>
    `;
    resHTML('WEB - create', '', '', '', $formHTML);
  }else if(pathName === '/create_process') {
    var body = '';
    request.on('data', (data)=> {
      body = body + data;
    });
    request.on('end', ()=> {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`./data/${title}`, description, (err) => {
        if(err) {
          console.error(err);
          response.writeHead(404);
          response.end('create process fail');
        }else {
          fs.readdir('./data', 'utf8', (err, files)=> {
            var html = template.html(title, template.list(files), '', '', `<h2>${title}</h2>${description}`);
            response.writeHead(200);
            response.end(html);
          });
        }
      });
    }); 
  }else if(pathName === '/update') {
    var title = queryData.id;
    var filteredId = path.parse(!queryData.id?'':queryData.id).base;
    fs.readFile('./data/' + filteredId, 'utf8', (err, description)=> {
      var $formHTML = `
        <form action="http://localhost:3000/update_process" method="post">
          <input type="hidden" name="id" value="${title}"/>
          <p><input type="text" name="title" value="${title}"/></p>
          <p><textarea name="description" placeholder="description">${description}</textarea>
          <p><input type="submit" value="update"/></p>
        </form>
      `;
      resHTML('WEB - update', '', '', '', $formHTML);
    });
  }else if(pathName === '/update_process') {
    var body = '';
    request.on('data', (data)=> {
      body = body + data;
    });
    request.on('end', ()=> {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, (err) => {
        if(err) {
          console.error(err);
          response.writeHead(404);
          response.end('update process rename fail');
        }else {
          fs.writeFile(`./data/${title}`, description, (err) => {
            if(err) {
              console.error(err);
              response.writeHead(404);
              response.end('update process writefile fail');
            }else {
              fs.readdir('./data', 'utf8', (err, files)=> {
                var html = template.html(title, template.list(files), $create, $update, $delete, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(html);
              });
            }
          });
        }
      }); 
      
    }); 
  }else if(pathName === '/delete_process') {
    var body = '';
    request.on('data', (data)=> {
      body = body + data;
    });
    request.on('end', ()=> {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`,function(err){
        console.log("에러", err);
        if(err) {
          console.log(err);
          response.writeHead(404);
          response.end('update process writefile fail');
        }else {
          console.log('file deleted successfully');
          // resHTML('Welcome', $create, '', '', 'Hello, nodejs');
          response.writeHead(302, {Location: `/`});
          response.end();
        }
        
      });  
    });
    
  }else {
    
    response.writeHead(404);
    response.end('Not found');
  }
  
  

});
app.listen(3000);