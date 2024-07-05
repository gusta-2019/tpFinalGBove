const socket = io();

socket.on("usuarios", (data) => {
    renderUsuarios(data);
});

// Función para renderizar los usuarios
const renderUsuarios = (usuarios) => {
    const contenedorUsuarios = document.getElementById("contenedorUsuarios");
    contenedorUsuarios.innerHTML = "";

    usuarios.forEach(user => {
        const userItem = document.createElement("div");
        userItem.classList.add("user-item");

        userItem.innerHTML = `
            <p style="color:white">Nombre: ${user.first_name}</p>
            <p style="color:white">Apellido: ${user.last_name}</p>
            <p style="color:white">Email: ${user.email}</p>
            <p style="color:white">Rol: ${user.role}</p>
            <form id="roleForm_${user._id}">
                <label for="role" style="color:white">Selecciona el nuevo Rol a aplicar:</label>
                <select name="role" id="role_${user._id}">
                    <option value="usuario" ${user.role === 'usuario' ? 'selected' : ''}>Usuario</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    <option value="premium" ${user.role === 'premium' ? 'selected' : ''}>Premium</option>
                </select>
                <button type="button" onclick="updateRole('${user._id}')">Guardar</button>
            </form>
            <form id="deleteForm_${user._id}">
                <button type="button" onclick="deleteUser('${user._id}')">Eliminar Usuario</button>
            </form>
        `;

        contenedorUsuarios.appendChild(userItem);
    });
};

// Función para actualizar el rol del usuario
const updateRole = (id) => {
    const role = document.getElementById(`role_${id}`).value;
    socket.emit("actualizarRol", { id, role });
};

// Función para eliminar el usuario
const deleteUser = (id) => {
    socket.emit("eliminarUsuario", id);
};
