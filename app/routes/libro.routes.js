module.exports = app => {
    const libros = require("../controllers/libro.controller.js");
    var router = require("express").Router();

    router.post("/create", libros.create);

    router.get("/", libros.findAll);

    router.get("/:id", libros.findOne);

    router.put("/update/:id", libros.update);

    router.delete("/delete/:id", libros.delete);

    router.delete("/delete", libros.deleteAll);
    
    app.use("/api/customer/libro", router); 
};