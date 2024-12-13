const app = require("./app");
//const swaggerUi = require("swagger-ui-express");
//const swaggerDocument = require("../config/swagger.json");

//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API disponible sur http://localhost:${PORT}/api/context`);
});

