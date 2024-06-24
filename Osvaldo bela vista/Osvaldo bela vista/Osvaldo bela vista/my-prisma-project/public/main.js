document.addEventListener('DOMContentLoaded', async () => {
    fetchUser();
    fetchAdmins();
});

async function fetchUser() {
    try {
        const response = await fetch('http://localhost:3001/user');
        const user = await response.json();
        renderUsers(user);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

function renderUsers(users) {
    const tbody = document.getElementById('user-tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = createRow(user);
        tbody.appendChild(row);
    });
}


async function fetchAdmins() {
    try {
        const response = await fetch('http://localhost:3001/administrador');
        const admins = await response.json();
        renderAdmins(admins);
    } catch (error) {
        console.error('Erro ao buscar administradores:', error);
    }
}

async function deleteUser(id, entity) {
    const url = `http://localhost:3001/user/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Usuário com ID ${id} excluído com sucesso.`);
            document.querySelector(`#${entity}-tbody tr[data-id="${id}"]`).remove();
        } else {
            console.error(`Erro ao excluir usuário com ID ${id}: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Erro ao excluir usuário com ID ${id}:`, error);
    }
}

async function deleteAdmin(id, entity) {
    const url = `http://localhost:3001/administrador/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Administrador com ID ${id} excluído com sucesso.`);
            document.querySelector(`#${entity}-tbody tr[data-id="${id}"]`).remove();
        } else {
            console.error(`Erro ao excluir administrador com ID ${id}: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Erro ao excluir administrador com ID ${id}:`, error);
    }
}

async function editUser(id) {
    try {
        const response = await fetch(`http://localhost:3001/user/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar usuário com ID ${id}: ${response.status} - ${response.statusText}`);
        }
        const user = await response.json();

        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-user-name').value = user.nome_completo;
        document.getElementById('edit-user-email').value = user.email;
        document.getElementById('edit-user-phone').value = user.telefone;

        const editModal = new bootstrap.Modal(document.getElementById('edit-user-Modal'));
        editModal.show();
    } catch (error) {
        console.error(`Erro ao buscar usuário com ID ${id} para edição:`, error);
    }
}

async function updateUser() {
    const id = document.getElementById('edit-user-id').value;
    const nome_completo = document.getElementById('edit-user-name').value;
    const email = document.getElementById('edit-user-email').value;
    const telefone = document.getElementById('edit-user-phone').value;

    try {
        const response = await fetch(`http://localhost:3001/user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome_completo, email, telefone })
        });

        if (response.ok) {
            const updatedUser = await response.json();
            console.log(`Usuário com ID ${id} atualizado com sucesso.`);

            // Atualizar a linha na tabela com os novos dados
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.innerHTML = `
                    <td>${updatedUser.id}</td>
                    <td>${updatedUser.nome_completo}</td>
                    <td>${updatedUser.email}</td>
                    <td>${updatedUser.telefone}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editUser(${updatedUser.id})">Editar</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${updatedUser.id})">Excluir</button>
                    </td>
                `;

                const editUserModal = new bootstrap.Modal(document.getElementById('edit-user-Modal'));
                editUserModal.hide(); // Esconder o modal após a edição
            }
        } else {
            console.error(`Erro ao atualizar usuário com ID ${id}: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
    }
}

function updateTableRow(user) {
    const row = document.querySelector(`#user-tbody tr[data-id="${user.id}"]`);
    if (row) {
        row.children[1].innerText = user.nome_completo;
        row.children[2].innerText = user.email;
        row.children[3].innerText = user.telefone;
    }
}
async function editUser(id) {
    try {
        const response = await fetch(`http://localhost:3001/user/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar usuário com ID ${id}: ${response.status} - ${response.statusText}`);
        }
        const user = await response.json();

        // Preencher o modal de edição com os dados do usuário
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-user-name').value = user.nome_completo;
        document.getElementById('edit-user-email').value = user.email;
        document.getElementById('edit-user-phone').value = user.telefone;

        const editUserModal = new bootstrap.Modal(document.getElementById('edit-user-Modal'));
        editUserModal.show();
    } catch (error) {
        console.error(`Erro ao buscar usuário com ID ${id} para edição:`, error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    fetchUser();
    fetchAdmins();
    updateHeaderWithUsername();
});

function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function updateHeaderWithUsername() {
    const username = getCookie('username');
    if (username) {
        const loginElement = document.getElementById('login-header');
        if (loginElement) {
            loginElement.textContent = username;
        }
    }
}


function renderAdmins(admins) {
    const tbody = document.getElementById('admin-tbody');
    tbody.innerHTML = '';

    admins.forEach(admin => {
        const row = createRow(admin, 'admin');
        tbody.appendChild(row);
    });
}

function createRow(data, entity) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', data.id);
    row.innerHTML = `
        <td>${data.id}</td>
        <td>${data.nome_completo}</td>
        <td>${data.email}</td>
        <td>${data.telefone}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary" onclick="editEntity(${data.id}, '${entity}')">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="delete${entity.charAt(0).toUpperCase() + entity.slice(1)}(${data.id}, '${entity}')">Excluir</button>
        </td>
    `;
    return row;
}

function showAddModal(entity) {
    const addModal = new bootstrap.Modal(document.getElementById(`add-${entity}-Modal`));
    addModal.show();
}

document.getElementById('addForm-user').addEventListener('submit', async (event) => {
    event.preventDefault();
    const nome_completo = document.getElementById('name-user').value;
    const email = document.getElementById('email-user').value;
    const telefone = document.getElementById('phone-user').value;

    try {
        const response = await fetch('http://localhost:3001/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome_completo, email, telefone })
        });

        if (response.ok) {
            const newUser = await response.json();
            console.log(`Usuário adicionado com sucesso.`);
            document.getElementById('addForm-user').reset();
            const row = createRow(newUser, 'user');
            document.getElementById('user-tbody').appendChild(row);
            const addModal = new bootstrap.Modal(document.getElementById('add-user-Modal'));
            addModal.hide();
        } else {
            console.error(`Erro ao adicionar usuário: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
    }
});

document.getElementById('addForm-admin').addEventListener('submit', async (event) => {
    event.preventDefault();
    const nome_completo = document.getElementById('name-admin').value;
    const email = document.getElementById('email-admin').value;
    const telefone = document.getElementById('phone-admin').value;

    try {
        const response = await fetch('http://localhost:3001/administrador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome_completo, email, telefone })
        });

        if (response.ok) {
            const newAdmin = await response.json();
            console.log(`Administrador adicionado com sucesso.`);
            document.getElementById('addForm-admin').reset();
            const row = createRow(newAdmin, 'admin');
            document.getElementById('admin-tbody').appendChild(row);
            const addModal = new bootstrap.Modal(document.getElementById('add-admin-Modal'));
            addModal.hide();
        } else {
            console.error(`Erro ao adicionar administrador: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao adicionar administrador:', error);
    }
});

function showEditModal(data, entity) {
    document.getElementById(`edit-${entity}-id`).value = data.id;
    document.getElementById(`edit-${entity}-name`).value = data.nome_completo;
    document.getElementById(`edit-${entity}-email`).value = data.email;
    document.getElementById(`edit-${entity}-phone`).value = data.telefone;

    const editModal = new bootstrap.Modal(document.getElementById(`edit-${entity}-Modal`));
    editModal.show();
}

function updateTableRow(data, entity) {
    const row = document.querySelector(`#${entity}-tbody tr[data-id="${data.id}"]`);
    if (row) {
        row.children[1].innerText = data.nome_completo;
        row.children[2].innerText = data.email;
        row.children[3].innerText = data.telefone;
    }
}
