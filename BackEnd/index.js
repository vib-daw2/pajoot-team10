const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const port = 5556;

app.get('/', function(req, res) {
  
  res.send('Hello express!');
});
app.get('/hola', function(req, res) {
  
    res.send('Hola que tal!');
});
app.get('/adeu', function(req, res) {
  
    res.send('Engastaluego!');
});
// ARA HO HEM AFEGIT DINTRE DE L'HTML AJUDA
//
// app.get("/form", (req, res) => {    
//     const html =`<!DOCTYPE html><html><head><title>Prova</title></head><body>
//        <form method='POST' action='http://localhost:5556/processar'>
//          <input type='text' name='prova'>
//          <input type='submit' value='enviar'></form></body></html>`;
//     res.send(html);     
//  });
 app.post("/processar", (req, res) => {
   
    console.log('peticio POST rebuda')
    console.log(req.body);
    
    res.send('Petició POST');   
   
 });

app.get('/parametre1', function(req, res) {
    // Exemple: parametre1?id=10
    console.log(req.query);
    res.send('Paràmetres ' + req.query.id);
  });
  
  app.get('/parametre2/:id', function(req, res) {
    // Exemple: parametre2/10
    console.log(req.params);
    res.send('Paràmetres ' + req.params.id);
  });
  
  
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});