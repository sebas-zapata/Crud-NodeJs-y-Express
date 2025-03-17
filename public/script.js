const API_URL = 'http://localhost:3000/users';

function showAlert(message, type = "success") {
    const alertContainer = document.getElementById("alertContainer");
    
    // Crear la alerta en HTML
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Ocultar la alerta después de 3 segundos
    setTimeout(() => {
        alertContainer.innerHTML = "";
    }, 3000);
}


// Obtener usuarios al cargar la página
document.addEventListener('DOMContentLoaded', loadUsers);

function loadUsers() {
    fetch(API_URL)
        .then(response => response.json())
        .then(users => {
            const userTable = document.getElementById('userTable');
            userTable.innerHTML = ''; // Limpiar tabla
            users.forEach(user => {
                userTable.innerHTML += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.age}</td>
                        <td>
                            <button class="btn btn-warning btn-sm m-1" onclick="openEditModal(${user.id}, '${user.name}', '${user.email}', ${user.age})" data-bs-toggle="modal" data-bs-target="#editUserModal">Editar</button>
                            <button class="btn btn-danger btn-sm m-1" onclick="confirmDelete(${user.id})">Eliminar</button>
                        </td>
                    </tr>`;
            });
        });
}

// Agregar usuario
document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, age })
    })
        .then(() => {
            this.reset();
            loadUsers();
            showAlert("Usuario agregado correctamente", "success");
        });
        
});

// Función para mostrar el modal de confirmación
function confirmDelete(id) {
    userIdToDelete = id; // Guardar ID del usuario a eliminar
    let modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    modal.show();
}

// 🔹 Eliminar usuario después de la confirmación
document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    if (userIdToDelete !== null) {
        fetch(`${API_URL}/${userIdToDelete}`, { method: 'DELETE' })
            .then(() => {
                loadUsers();
                showAlert("Usuario eliminado correctamente", "danger");
            })
            
    }
    userIdToDelete = null; // Resetear la variable
    let modal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
    modal.hide();
});

// 🟡 Abrir el modal con los datos del usuario seleccionado
function openEditModal(id, name, email, age) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;
    document.getElementById('editAge').value = age;
}

// 🟢 Guardar cambios del usuario editado
document.getElementById('editUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const age = document.getElementById('editAge').value;

    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, age })
    })
        .then(() => {
            document.querySelector('#editUserModal .btn-close').click(); // Cerrar modal
            loadUsers(); // Recargar la lista de usuarios
            showAlert("Usuario editado correctamente", "info");
        });
});
