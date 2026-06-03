const API_URL = "http://127.0.0.1:8000";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const dashboard = document.getElementById("dashboard");
const logoutBtn = document.getElementById("logoutBtn");

function showDashboard() {
    dashboard.classList.remove("d-none");
    loginForm.closest(".card").classList.add("d-none");
}

function showLogin() {
    dashboard.classList.add("d-none");
    loginForm.closest(".card").classList.remove("d-none");
}

function setMessage(message, type) {
    loginMessage.textContent = message;

    if (type === "success") {
        loginMessage.className = "mt-3 text-center small text-success";
    } else {
        loginMessage.className = "mt-3 text-center small text-danger";
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

        setMessage("Inicio de sesión exitoso", "success");

        showDashboard();

    } catch (error) {
        localStorage.removeItem("token");
        setMessage(error.message, "error");
    }
});

logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("token");
    showLogin();
});

const savedToken = localStorage.getItem("token");

if (savedToken) {
    showDashboard();
}