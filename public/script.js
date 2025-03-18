const API_URL = 'http://localhost:3000/api/users';

// Función para mostrar alertas
function showAlert(message, type = "success") {
    const alertContainer = document.getElementById("alertContainer");
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    setTimeout(() => {
        alertContainer.innerHTML = "";
    }, 3000);
}

// Cargar usuarios al iniciar
document.addEventListener('DOMContentLoaded', loadUsers);

function loadUsers() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener los usuarios');
            return response.json();
        })
        .then(users => {
            const userTable = document.getElementById('userTable');
            userTable.innerHTML = '';
            users.forEach(user => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.age}</td>
                    <td>
                        <button class="btn btn-warning btn-sm m-1" onclick="openEditModal(${user.id}, '${user.name}', '${user.email}', ${user.age})" data-bs-toggle="modal" data-bs-target="#editUserModal">Editar</button>
                        <button class="btn btn-danger btn-sm m-1" onclick="confirmDelete(${user.id})">Eliminar</button>
                    </td>
                `;
                userTable.appendChild(row);
            });
        })
        .catch(error => showAlert(error.message, "danger"));
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
    .then(response => {
        if (!response.ok) throw new Error('Error al agregar usuario');
        return response.json();
    })
    .then(() => {
        this.reset();
        
        // Cerrar modal correctamente
        const addUserModal = document.getElementById("addUserModal");
        if (addUserModal) {
            const modalInstance = bootstrap.Modal.getInstance(addUserModal);
            if (modalInstance) modalInstance.hide();
        }

        loadUsers();
        showAlert("Usuario agregado correctamente", "success");
    })
    .catch(error => showAlert(error.message, "danger"));
});

// Mostrar el modal de confirmación para eliminar usuario
let userIdToDelete = null;
function confirmDelete(id) {
    userIdToDelete = id;
    const deleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    deleteModal.show();
}

// Eliminar usuario después de la confirmación
document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    if (userIdToDelete !== null) {
        fetch(`${API_URL}/${userIdToDelete}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Error al eliminar usuario');
                return response.json();
            })
            .then(() => {
                loadUsers();
                showAlert("Usuario eliminado correctamente", "danger");
            })
            .catch(error => showAlert(error.message, "danger"));

        userIdToDelete = null;
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
        deleteModal.hide();
    }
});

// Abrir el modal de edición con los datos del usuario
function openEditModal(id, name, email, age) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;
    document.getElementById('editAge').value = age;
}

// Guardar cambios del usuario editado
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
    .then(response => {
        if (!response.ok) throw new Error('Error al actualizar usuario');
        return response.json();
    })
    .then(() => {
        // Cerrar modal correctamente
        const editUserModal = document.getElementById("editUserModal");
        if (editUserModal) {
            const modalInstance = bootstrap.Modal.getInstance(editUserModal);
            if (modalInstance) modalInstance.hide();
        }

        loadUsers();
        showAlert("Usuario editado correctamente", "info");
    })
    .catch(error => showAlert(error.message, "danger"));
});
