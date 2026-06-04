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

const generateRecipeBtn = document.getElementById("generateRecipeBtn");
const recipeMessage = document.getElementById("recipeMessage");
const generatedRecipe = document.getElementById("generatedRecipe");

const recipesList = document.getElementById("recipesList");
const refreshRecipesBtn = document.getElementById("refreshRecipesBtn");

let userRatings = [];

function getToken() {
    return localStorage.getItem("token");
}

function showDashboard() {
    dashboard.classList.remove("d-none");
    loginForm.closest(".card").classList.add("d-none");

    loadIngredients();
    loadRecipes();
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

function setRecipeMessage(message, type) {
    recipeMessage.textContent = message;

    if (type === "success") {
        recipeMessage.className = "small mb-3 text-success";
    } else if (type === "loading") {
        recipeMessage.className = "small mb-3 text-primary";
    } else {
        recipeMessage.className = "small mb-3 text-danger";
    }
}

function parseJsonField(value) {
    try {
        return JSON.parse(value);
    } catch (error) {
        return [];
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

generateRecipeBtn.addEventListener("click", async function () {
    const token = getToken();

    if (!token) {
        setRecipeMessage("Debes iniciar sesión", "error");
        return;
    }

    try {
        generateRecipeBtn.disabled = true;
        generateRecipeBtn.textContent = "Generando...";

        setRecipeMessage("Generando receta con IA. Esto puede tardar unos segundos.", "loading");

        const response = await fetch(`${API_URL}/recipes/generate`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("No se pudo generar la receta");
        }

        const recipe = await response.json();

        if (recipe.message) {
            setRecipeMessage(recipe.message, "error");
            return;
        }

        renderGeneratedRecipe(recipe);

        setRecipeMessage("Receta generada correctamente", "success");

        loadRecipes();

    } catch (error) {
        setRecipeMessage(error.message, "error");
    } finally {
        generateRecipeBtn.disabled = false;
        generateRecipeBtn.textContent = "Generar receta";
    }
});

function renderGeneratedRecipe(recipe) {
    const ingredients = parseJsonField(recipe.ingredientes_json);
    const steps = parseJsonField(recipe.pasos_json);

    generatedRecipe.innerHTML = `
        <div class="recipe-result border rounded p-4 bg-light">

            <h3 class="mb-3">
                ${recipe.nombre_plato}
            </h3>

            <div class="mb-3">
                <span class="badge bg-primary me-2">
                    ${recipe.tiempo_estimado || "Sin tiempo estimado"}
                </span>

                <span class="badge bg-secondary">
                    ${recipe.nivel_dificultad || "Sin dificultad"}
                </span>
            </div>

            <h5>Ingredientes</h5>

            <ul>
                ${ingredients.map(function (ingredient) {
        return `<li>${ingredient}</li>`;
    }).join("")}
            </ul>

            <h5>Pasos</h5>

            <ol>
                ${steps.map(function (step) {
        return `<li>${step}</li>`;
    }).join("")}
            </ol>

        </div>
    `;
}

async function loadRecipes() {
    const token = getToken();

    if (!token) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/recipes/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("No se pudieron cargar las recetas");
        }

        const recipes = await response.json();

        renderRecipes(recipes);

    } catch (error) {
        recipesList.innerHTML = `
            <p class="text-danger">
                ${error.message}
            </p>
        `;
    }
}


function renderRecipes(recipes) {
    if (recipes.length === 0) {
        recipesList.innerHTML = `
            <p class="text-muted">
                Todavía no hay recetas guardadas.
            </p>
        `;
        return;
    }

    recipesList.innerHTML = "";

    recipes.forEach(function (recipe) {
        const ingredients = parseJsonField(recipe.ingredientes_json);
        const steps = parseJsonField(recipe.pasos_json);

        const item = document.createElement("div");

        item.className = "recipe-history-item border rounded p-4 mb-3 bg-light";

        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-3">

                <div>
                    <h4 class="mb-2">
                        ${recipe.nombre_plato}
                    </h4>

                    <div>
    <span class="badge bg-primary me-2">
        ${recipe.tiempo_estimado || "Sin tiempo"}
    </span>

    <span class="badge bg-secondary">
        ${recipe.nivel_dificultad || "Sin dificultad"}
    </span>
</div>

<div class="d-flex align-items-center gap-2 mt-3">
    <select
        id="rating-${recipe.id}"
        class="form-select form-select-sm rating-select"
    >
        <option value="">Puntuar</option>
        <option value="1">1 ⭐</option>
        <option value="2">2 ⭐⭐</option>
        <option value="3">3 ⭐⭐⭐</option>
        <option value="4">4 ⭐⭐⭐⭐</option>
        <option value="5">5 ⭐⭐⭐⭐⭐</option>
    </select>

    <button
        class="btn btn-outline-warning btn-sm"
        onclick="rateRecipe(${recipe.id})"
    >
        Calificar
    </button>
</div>

                </div>

                <button
                    class="btn btn-outline-danger btn-sm"
                    onclick="deleteRecipe(${recipe.id})"
                >
                    Eliminar
                </button>

            </div>

            <div class="row">

                <div class="col-md-5">
                    <h6>Ingredientes</h6>

                    <ul>
                        ${ingredients.map(function (ingredient) {
            return `<li>${ingredient}</li>`;
        }).join("")}
                    </ul>
                </div>

                <div class="col-md-7">
                    <h6>Pasos</h6>

                    <ol>
                        ${steps.map(function (step) {
            return `<li>${step}</li>`;
        }).join("")}
                    </ol>
                </div>

            </div>
        `;

        recipesList.appendChild(item);
    });
}


async function deleteRecipe(id) {
    const token = getToken();

    if (!token) {
        setRecipeMessage("Debes iniciar sesión", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/recipes/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("No se pudo eliminar la receta");
        }

        setRecipeMessage("Receta eliminada correctamente", "success");

        loadRecipes();

        generatedRecipe.innerHTML = "";

    } catch (error) {
        setRecipeMessage(error.message, "error");
    }
}


refreshRecipesBtn.addEventListener("click", function () {
    loadRecipes();
});

async function rateRecipe(recipeId) {
    const token = getToken();

    if (!token) {
        setRecipeMessage("Debes iniciar sesión", "error");
        return;
    }

    const ratingSelect = document.getElementById(`rating-${recipeId}`);

    if (!ratingSelect || !ratingSelect.value) {
        setRecipeMessage("Selecciona una puntuación antes de calificar", "error");
        return;
    }

    const ratingValue = parseInt(ratingSelect.value);

    try {
        const response = await fetch(`${API_URL}/ratings/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                receta_id: recipeId,
                puntuacion: ratingValue
            })
        });

        if (!response.ok) {
            throw new Error("No se pudo calificar la receta");
        }

        setRecipeMessage("Receta calificada correctamente", "success");

        ratingSelect.value = "";

    } catch (error) {
        setRecipeMessage(error.message, "error");
    }
}

const savedToken = localStorage.getItem("token");

if (savedToken) {
    showDashboard();
}