const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository(); 
const MessageModel = require("../models/message.model.js");

const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó");
            
            socket.emit("productos", await productRepository.obtenerProductos() );
            socket.emit("usuarios", await userRepository.obtenerUsuarios());
            
            socket.on("eliminarProducto", async (id) => {
                await productRepository.eliminarProducto(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("agregarProducto", async (producto) => {
                await productRepository.agregarProducto(producto);
                console.log(producto);
                this.emitUpdatedProducts(socket);
            });

            socket.on("actualizarRol", async ({ id, role }) => {
                await userRepository.actualizarRol(id, role);
                this.emitUpdatedUsers(socket);
            });

            socket.on("eliminarUsuario", async (id) => {
                await userRepository.eliminarUsuario(id);
                this.emitUpdatedUsers(socket);
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("productos", await productRepository.obtenerProductos());
    }

    async emitUpdatedUsers(socket) {
        socket.emit("usuarios", await userRepository.obtenerUsuarios());
    }
}

module.exports = SocketManager;


