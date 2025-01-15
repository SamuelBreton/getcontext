const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}/v1/context`);
  console.log(`Documentation Swagger disponible sur http://localhost:${PORT}/api-docs`);
});

