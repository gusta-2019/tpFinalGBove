const UserModel = require("../models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async create(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async save(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async obtenerUsuarios() {
        return await UserModel.find();
    }

    async actualizarRol(id, role) {
        return await UserModel.findByIdAndUpdate(id, { role });
    }

    async eliminarUsuario(id) {
        return await UserModel.findByIdAndDelete(id);
    }
}

module.exports = UserRepository;
