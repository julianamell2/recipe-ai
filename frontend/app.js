const API_URL = "http://127.0.0.1:8000";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const dashboard = document.getElementById("dashboard");
const logoutBtn = document.getElementById("logoutBtn");

const ingredientForm = document.getElementById("ingredientForm");
const ingredientName = document.getElementById("ingredientName");
const ingredientAmount = document.getElementById("ingredientAmount");
const ingredientMessage = document.getElementById("ingredientMessage");
const ingredientsList = document.getElementById("ingredientsList");
const refreshIngredientsBtn = document.getElementById("refreshIngredientsBtn");

function getToken() {
    return localStorage.getItem("token");
}

function showDashboard() {
    dashboard.classList.remove("d-none");
    loginForm.closest(".card").classList.add("d-none");

    loadIngredients();
}

function showLogin() {
    dashboard.classList.add("d-none");
    loginForm.closest(".card").classList.remove("d-none");
}

function setLoginMessage(message, type) {
    loginMessage.textContent = message;

    if (type === "success") {
        loginMessage.className = "mt-3 text-center small text-success";
    } else {
        loginMessage.className = "mt-3 text-center small text-danger";
    }
}

function setIngredientMessage(message, type) {
    ingredientMessage.textContent = message;

    if (type === "success") {
        ingredientMessage.className = "mt-3 text-center small text-success";
    } else {
        ingredientMessage.className = "mt-3 text-center small text-danger";
    }
}

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Credenciales inválidas");
        }

        const data = await response.json();

        localStorage.setItem("token", data.access_token);

        setLoginMessage("Inicio de sesión exitoso", "success");

        showDashboard();

    } catch (error) {
        localStorage.removeItem("token");
        setLoginMessage(error.message, "error");
    }
});

logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("token");
    showLogin();
});

ingredientForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = getToken();

    if (!token) {
        setIngredientMessage("Debes iniciar sesión", "error");
        return;
    }

    const ingredient = {
        nombre: ingredientName.value,
        cantidad: ingredientAmount.value
    };

    try {
        const response = await fetch(`${API_URL}/ingredients/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(ingredient)
        });

        if (!response.ok) {
            throw new Error("No se pudo guardar el ingrediente");
        }

        ingredientName.value = "";
        ingredientAmount.value = "";

        setIngredientMessage("Ingrediente guardado correctamente", "success");

        loadIngredients();

    } catch (error) {
        setIngredientMessage(error.message, "error");
    }
});

async function loadIngredients() {
    const token = getToken();

    if (!token) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/ingredients/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("No se pudieron cargar los ingredientes");
        }

        const ingredients = await response.json();

        renderIngredients(ingredients);

    } catch (error) {
        ingredientsList.innerHTML = `
            <p class="text-danger">
                ${error.message}
            </p>
        `;
    }
}

function renderIngredients(ingredients) {
    if (ingredients.length === 0) {
        ingredientsList.innerHTML = `
            <p class="text-muted">
                No hay ingredientes cargados todavía.
            </p>
        `;
        return;
    }

    ingredientsList.innerHTML = "";

    ingredients.forEach(function (ingredient) {
        const item = document.createElement("div");

        item.className = "ingredient-item d-flex justify-content-between align-items-center mb-2 p-3 bg-light rounded";

        item.innerHTML = `
            <div>
                <strong>${ingredient.nombre}</strong>
                <br>
                <small class="text-muted">${ingredient.cantidad}</small>
            </div>

            <button
                class="btn btn-outline-danger btn-sm"
                onclick="deleteIngredient(${ingredient.id})"
            >
                Eliminar
            </button>
        `;

        ingredientsList.appendChild(item);
    });
}

async function deleteIngredient(id) {
    const token = getToken();

    if (!token) {
        setIngredientMessage("Debes iniciar sesión", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/ingredients/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("No se pudo eliminar el ingrediente");
        }

        setIngredientMessage("Ingrediente eliminado", "success");

        loadIngredients();

    } catch (error) {
        setIngredientMessage(error.message, "error");
    }
}

refreshIngredientsBtn.addEventListener("click", function () {
    loadIngredients();
});

const savedToken = localStorage.getItem("token");

if (savedToken) {
    showDashboard();
}