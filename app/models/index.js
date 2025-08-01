const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // para conexiones sin certificado válido
    }
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.estudiantes = require("./estudiante.model.js")(sequelize, Sequelize);
db.libros = require("./libro.model.js")(sequelize, Sequelize);
db.prestamos = require("./prestamo.model.js")(sequelize, Sequelize);

// Relaciones
// Un libro puede tener muchos préstamos
db.libros.hasMany(db.prestamos, { foreignKey: "libroId" });
// Un estudiante puede tener muchos préstamos
db.estudiantes.hasMany(db.prestamos, { foreignKey: "estudianteId" });

// Un préstamo pertenece a un libro
db.prestamos.belongsTo(db.libros, { foreignKey: "libroId" });
// Un préstamo pertenece a un estudiante
db.prestamos.belongsTo(db.estudiantes, { foreignKey: "estudianteId" });

module.exports = db;