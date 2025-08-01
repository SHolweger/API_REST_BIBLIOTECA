//Exportar objetos para que puedan ser utilizados en otras clases
module.exports = (sequelize, Sequelize) => {
//sequelize.define: para "definir" el nombre de la entity en la BD, en este caso "cliente"
// type.Sequelize: para definir el tipo de datos de cada atributo de la entidad 
    const Estudiante = sequelize.define("estudiante", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING
        },
        carnet: {
            type: Sequelize.STRING
        },
        correo: {
            type: Sequelize.STRING
        }
    });
    return Estudiante;
};