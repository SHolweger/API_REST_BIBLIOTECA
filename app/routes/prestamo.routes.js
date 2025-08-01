module.exports = app => {
    const prestamos = require("../controllers/prestamo.controller.js");
    const router = require("express").Router();

    // Crear nuevo préstamo (POST /api/prestamos)
    router.post("/create", prestamos.create);

    // Obtener todos los préstamos (GET /api/prestamos)
    router.get("/", prestamos.findAll);

    // Obtener un préstamo por ID (GET /api/prestamos/:id)
    router.get("/:id", prestamos.findOne);

    // Obtener todos los préstamos de un estudiante (GET /api/prestamos/estudiante/:estudianteId)
    router.get("/estudiante/:estudianteId", prestamos.findAllByEstudiante);

    // Marcar como devuelto (PUT /api/prestamos/:id)
    router.put("/update/:id", prestamos.update);

    // Eliminar préstamo por ID (DELETE /api/prestamos/:id)
    router.delete("/delete/:id", prestamos.delete);

    // Eliminar todos los préstamos (DELETE /api/prestamos)
    router.delete("/delete", prestamos.deleteAll);

    // Usar el prefijo estándar RESTful
    app.use("/api/customer/prestamo", router);
};