const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a PostgreSQL');
    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas');
    app.listen(PORT, () =>
      console.log(`API en http://localhost:${PORT}  |  Docs en /api-docs`));
  } catch (err) {
    console.error('No se pudo iniciar:', err);
    process.exit(1);
  }
})();