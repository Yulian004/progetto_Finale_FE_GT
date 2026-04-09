let tasks = [];
let editingTaskId = null;

window.onload = () => {
    checkAuth();
    loadTasks();
    displayName();
}

// DISPLAY NAME
function displayName()
{
    document.getElementById("usernameDisplay").innerText = getUser().username;
}

const API_URL = "http://localhost:8080/api/tasks"
//caricamento tasks e renderizzazione in tabella
async function loadTasks(){
    const user = getUser();
    const res = await fetch(`${API_URL}/${user.id}`);
    tasks = await res.json();
    renderTasks();
}

function renderTasks(filteredTasks = tasks){
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";


     {

    filteredTasks.forEach(task => {
        const riga = document.createElement("tr");

        const creationDate = new Date(task.creationTimestamp).toLocaleDateString();
        const deadlineDate = new Date(task.deadlineTimestamp).toLocaleDateString();

        riga.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${creationDate}</td>
            <td>${deadlineDate}</td>
            <td>${priorityToText(task.priority)}</td>
            <td>
                <div style="display:flex;align-items:center;gap:5px;">
                    <input type="checkbox" ${task.status ? "checked" : ""}
                    onchange="toggleStatus(${task.id}, ${task.status})">
                    <span>${task.status ? "Completato" : "Non completato"}</span>
                </div>
            </td>
            <td>
                <button class="edit" onclick="openEditModal(${task.id})">Edit</button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
            </td> `;

            tbody.appendChild(riga);

    })
}

//------------------------------------------------------------------------------------   
}
//CRUD
//CREATE
async function createTask(task) {
    const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return await res.json();
}

//UPDATE
async function updateTask(id, updateTask)
{
    await fetch(`${API_URL}/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(updateTask)
        });
}

//DELETE
async function deleteTask(id){
    if(!confirm("Sei sicuro di eliminare questo task?")) return;

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}
//TOGGLE STATUS TRUE/FALSE
async function toggleStatus(id, currentStatus)
{
    const newStatus = !currentStatus;

    const task = tasks.find(t => t.id === id);
    if(task) task.status = newStatus;

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type" : "application/json"
        },
        body: JSON.stringify(task)
    });
 
    renderTasks();
}
//------------------------------------------------------------------------------

//FORM SUBMIT

document.querySelector("#taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = getUser();

    const newTask = {
        title: document.querySelector("#title").value,
        description: document.querySelector("#description").value,
        deadlineTimestamp: document.querySelector("#deadlineTimestamp").value,
        priority: document.querySelector("#priority").value,
        status:  false,
        userId: user.id
    };
    if(editingTaskId){
        await updateTask(editingTaskId, newTask);
        const index = tasks.findIndex(t => t.id === editingTaskId);
        if(index !== -1)
        {
            tasks[index] = {...tasks[index], ...newTask};
        }
        editingTaskId = null;
    }
    else
    {
        const createdTask = await createTask(newTask);
        tasks.push(createdTask);
    }
        renderTasks();
        resetForm();
        closeModal();
});



//----------------------------------------------------------------------------------------------
//Data odierna di creazione oggetto
function resetForm(){
    document.querySelector("#taskForm").reset();
    document.querySelector("#creationTimestamp").value = ""
}
function dataCreazione(){
    const creationData = document.querySelector('#creationTimestamp')

    const oggi = new Date();

    const yyyy = oggi.getFullYear();
    const mm = String(oggi.getMonth() + 1).padStart(2, "0");
    const dd = String(oggi.getDate()).padStart(2, "0");

    const formatDate = `${yyyy}-${mm}-${dd}`;

    creationData.value = formatDate;
}




//------------------------------------------------------------------------------------------
//FILTRI
function applyFilters()
{
    const priority = document.getElementById("filterPriority").value;
    const status = document.getElementById("filterStatus").value;

    let filtered = tasks;

    if(priority) filtered = filtered.filter(t => t.priority === priority)
    if(status !== "") filtered = filtered.filter(t => t.status.toString() === status)

    renderTasks(filtered);
}

//------------------------------------------------------------------------------------------
//APRI E CHIUDI MODULO
function openModal(){
    document.getElementById("taskModal").style.display = "flex";
}

function closeModal(){
    document.getElementById("taskModal").style.display = "none";
}

//--------------------------------------------------------------------------------------------
// Modifica e creazione con un solo Modal
function openEditModal(id)
{
    const task = tasks.find(t => t.id === id);

    editingTaskId = task.id;
     
    document.getElementById("modalTitle").innerText = "Modifica Task";

    document.querySelector("#title").value = task.title;
    document.querySelector("#description").value = task.description;
    document.querySelector("#creationTimestamp").value = task.creationTimestamp;
    document.querySelector("#deadlineTimestamp").value = task.deadlineTimestamp;
    document.querySelector("#priority").value = task.priority;

    openModal();
}

function openCreateModal()
{
    editingTaskId = null;

    resetForm();
    dataCreazione();

    document.getElementById("modalTitle").innerText = "Nuovo Task";

    openModal();
}

function priorityToText(value) {
    switch(value) {
        case "LOW": return "Basso";
        case "MEDIUM": return "Medio";
        case "HIGH": return "Alto";
        default: return value;
    }
}
