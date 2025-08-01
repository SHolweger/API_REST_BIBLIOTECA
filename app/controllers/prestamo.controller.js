const db = require("../models");
const Prestamo = db.prestamos;
const Estudiante = db.estudiantes;
const Libro = db.libros;
const Op = db.Sequelize.Op;

// Crear un nuevo préstamo
exports.create = async (req, res) => {
    const { libroId, estudianteId } = req.body;

    if (!libroId || !estudianteId) {
        return res.status(400).send({
            message: "¡El ID del libro y del estudiante no pueden estar vacíos!"
        });
    }

    try {
        const libro = await Libro.findByPk(libroId);
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }

        if (!libro.disponible) {
            return res.status(400).send({ message: "El libro no está disponible para préstamo." });
        }

        const nuevoPrestamo = await Prestamo.create({
            libroId,
            estudianteId,
            fechaPrestamo: new Date(),
            fechaDevolucion: null
        });

        await libro.update({ disponible: false });

        res.status(201).send(nuevoPrestamo);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Ocurrió un error al crear el préstamo."
        });
    }
};

// Obtener todos los préstamos
exports.findAll = (req, res) => {
    Prestamo.findAll({
        include: [
            { model: Libro },
            { model: Estudiante }
        ]
    })
    .then(data => res.send(data))
    .catch(err => {
        res.status(500).send({
            message: err.message || "Error al obtener los préstamos."
        });
    });
};

// Obtener un préstamo por ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Prestamo.findByPk(id, {
        include: [
            { model: Libro },
            { model: Estudiante }
        ]
    })
    .then(data => {
        if (data) res.send(data);
        else res.status(404).send({ message: `No se encontró el préstamo con id=${id}` });
    })
    .catch(err => {
        res.status(500).send({ message: `Error al obtener el préstamo con id=${id}` });
    });
};

// Obtener préstamos por ID de estudiante
exports.findAllByEstudiante = async (req, res) => {
    const estudianteId = req.params.estudianteId;

    try {
        const estudiante = await Estudiante.findByPk(estudianteId);
        if (!estudiante) {
            return res.status(404).send({ message: "Estudiante no encontrado." });
        }

        const prestamos = await Prestamo.findAll({
            where: { estudianteId },
            include: [{ model: Libro }]
        });

        res.send(prestamos);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error al obtener los préstamos del estudiante."
        });
    }
};

// Actualizar un préstamo (marcar como devuelto)
exports.update = async (req, res) => {
    const id = req.params.id;
    const { fechaDevolucion } = req.body;

    try {
        const prestamo = await Prestamo.findByPk(id);
        if (!prestamo) {
            return res.status(404).send({ message: `No se encontró el préstamo con id=${id}` });
        }

        await prestamo.update({ fechaDevolucion });

        if (fechaDevolucion) {
            const libro = await Libro.findByPk(prestamo.libroId);
            if (libro) {
                await libro.update({ disponible: true });
            }
        }

        res.send({ message: "El préstamo fue actualizado correctamente." });
    } catch (err) {
        res.status(500).send({
            message: `Error al actualizar el préstamo con id=${id}`
        });
    }
};

// Eliminar un préstamo por ID
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const prestamo = await Prestamo.findByPk(id);
        if (!prestamo) return res.status(404).send({ message: `No se encontró el préstamo con id=${id}` });

        if (!prestamo.fechaDevolucion) {
            const libro = await Libro.findByPk(prestamo.libroId);
            if (libro) await libro.update({ disponible: true });
        }

        await Prestamo.destroy({ where: { id } });
        res.send({ message: "El préstamo fue eliminado correctamente." });

    } catch (err) {
        res.status(500).send({ message: `Error al eliminar el préstamo con id=${id}` });
    }
};

// Eliminar todos los préstamos
exports.deleteAll = (req, res) => {
    Prestamo.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} préstamos fueron eliminados correctamente.` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al eliminar todos los préstamos."
            });
        });
};
