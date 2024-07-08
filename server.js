const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors'); // Importe le module cors

// Utilise cors pour gérer les CORS
server.use(cors());

// Middleware pour structurer les réponses
server.use((req, res, next) => {
  res.customResponse = (code, message, data) => {
    res.jsonp({
      code,
      message,
      data
    });
  };
  next();
});

// Utiliser le routeur JSON Server
server.use(router);

// Middleware pour personnaliser les réponses
router.render = (req, res) => {
  const data = res.locals.data;
  res.customResponse(200, 'Success', data);
};

// Démarrer le serveur
server.use(middlewares);
server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});
