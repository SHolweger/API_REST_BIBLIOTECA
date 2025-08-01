const db = require("../models");
const Libro = db.libros;
const Op = db.Sequelize.Op;

// Crear un nuevo libro
exports.create = (req, res) => {
    // Validamos que dentro del  request no venga vacio el nombre, de lo contrario returna error
    if (!req.body.titulo) {
        res.status(400).send({
            message: "¡El nombre no puede estar vacío!"
        });
        return;
    }
    const libro = {
        titulo: req.body.titulo,
        autor: req.body.autor,
        anioPublicacion: req.body.anioPublicacion,
        publicado: req.body.publicado,
        genero: req.body.genero,
        disponible: req.body.disponible
    };

    Libro.create(libro)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrió un error al crear el libro."
            });
        });
};

// Obtener todos los libros *PENDIENTE*
exports.findAll = (req, res) => {
    const Titulo = req.query.Titulo;
    var condition = Titulo ? { Titulo: { [Op.iLike]: `%${Titulo}%` } } : null;

    Libro.findAll({ where: condition })
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

// Obtener un libro por ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Libro.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: "No se encontró el libro con id=" + id
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener el libro con id=" + id
            });
        });
};


// Actualizar un libro
exports.update = (req, res) => {
    const id = req.params.id;

    Libro.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El libro fue actualizado correctamente."
                });
            } else {
                res.send({
                    message: `No se pudo actualizar el libro con id=${id}. ¡Quizás no se encontró el libro o el cuerpo de la solicitud está vacío!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar el libro con id=" + id
            });
        });
};

// Eliminar un libro
exports.delete = (req, res) => {
    const id = req.params.id;
    Libro.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El libro fue eliminado correctamente."
                });
            } else {
                res.send({
                    message: `No se pudo eliminar el libro con id=${id}. ¡El libro no fue encontrado!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "No se pudo eliminar el libro con id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Libro.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Libros fueron eliminados correctamente.` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrió un error al eliminar todos los Libros."
            });
        });
};