module.exports = {
    html: (title, $fileList, $create, $update, $delete, body)=> {
      return `
        <!doctype html>
        <html>
        <head>
          <title>WEB - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${$fileList}
          ${$create}
          ${$update}
          ${$delete}
          ${body}
          
        </body>
        </html>
      `;
    },
    list: (files)=> {
  
      var $fileList = "<ol>";
      
      for(var i=0; i<files.length; i++) {
        $fileList = $fileList + `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
      }
    
      $fileList = $fileList + "</ol>";
      return $fileList;
    }
  }

  