const db = require("../models");
const Estudiante = db.estudiantes;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validamos que dentro del  request no venga vacio el nombre, de lo contrario returna error
    if (!req.body.nombre) {
        res.status(400).send({
            message: "¡El nombre no puede estar vacío!"
        });
        return;
    }

    const estudiante = {
        nombre: req.body.nombre,
        carnet: req.body.carnet,
        correo: req.body.correo,
    };

    Estudiante.create(estudiante)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrió un error al crear el Estudiante."
            });
        });
};

//Get all
exports.findAll = (req, res) => {
    const nombre = req.query.nombre;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Estudiante.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrió un error al obtener los Estudiantes."
            });
        });
};

// Get by ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Estudiante.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: "No se encontró el Estudiante con id=" + id
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener el Estudiante con id=" + id
            });
        });
};


exports.update = (req, res) => {
    const id = req.params.id;

    Estudiante.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El Estudiante fue actualizado correctamente."
                });
            } else {
                res.send({
                    message: `No se pudo actualizar el Estudiante con id=${id}. ¡Quizás no se encontró el Estudiante o el cuerpo de la solicitud está vacío!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar el Estudiante con id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Estudiante.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El Estudiante fue eliminado correctamente."
                });
            } else {
                res.send({
                    message: `No se pudo eliminar el Estudiante con id=${id}. ¡El Estudiante no fue encontrado!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "No se pudo eliminar el Estudiante con id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Estudiante.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Estudiantes fueron eliminados correctamente.` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrió un error al eliminar todos los Estudiantes."
            });
        });
};