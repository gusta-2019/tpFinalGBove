const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");

const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);

//Tercer integradora: 
router.post("/requestPasswordReset", userController.requestPasswordReset); // Nueva ruta
router.post('/reset-password', userController.resetPassword);

//Cuarta Integradora

router.put("/premium/:uid", userController.cambiarRolPremium);

const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();

const upload = require("../middleware/multer.js")

router.post('/:uid/documents', upload.fields([
    { name: 'document' }, { name: 'products' }, { name: 'profile' }]), async (req, res) => {
        const { uid } = req.params;
        const uploadedDocuments = req.files;

        try {
            const user = await userRepository.findById(uid);

            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Verificar si se subieron documentos y actualizar el usuario
            if (uploadedDocuments) {
                if (uploadedDocuments.document) {
                    user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })));
                }
                if (uploadedDocuments.products) {
                    user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path 
                    })));
                }
                if (uploadedDocuments.profile) {
                    user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path 
                    })));
                }
            }

            // Guardar los cambios en la base de datos
            await user.save();

            res.status(200).send("Documentos subidos exitosamente");
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    });

// Nuevas rutas para actualizar rol y eliminar usuario
router.post("/users/:uid/updateRole", userController.updateRole);
router.post("/users/:uid/delete", userController.deleteUser);

module.exports = router;

