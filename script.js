document.addEventListener("DOMContentLoaded", () => {
    // ===== Configuración de Mercado Pago =====
    const mp = new MercadoPago("APP_USR-c636cfaa-8a31-4584-892d-32d5ca3a2028", {
        locale: "es-AR", // Configura el idioma
    });

    // ===== Funcionalidad del botón hacia atrás =====
    const botonAtras = document.getElementById("boton-atras");
    if (botonAtras) {
        botonAtras.addEventListener("click", () => {
            window.history.back(); // Retrocede en el historial del navegador
        });
    }

    // ===== Funcionalidad del Buscador =====
    document.getElementById("boton-buscar").addEventListener("click", function () {
        const textoBusqueda = document.getElementById("buscador-input").value.toLowerCase();
        const productos = document.querySelectorAll(".producto");

        productos.forEach((producto) => {
            const nombreProducto = producto.querySelector("h3").textContent.toLowerCase();
            if (nombreProducto.includes(textoBusqueda)) {
                producto.style.display = "block";
            } else {
                producto.style.display = "none";
            }
        });
    });

    // ===== Funcionalidad de los Botones de Filtrado =====
    document.getElementById("filtro-gomita").addEventListener("click", function () {
        filtrarProductos("gomita");
    });

    document.getElementById("filtro-regaliz").addEventListener("click", function () {
        filtrarProductos("regaliz");
    });

    function filtrarProductos(categoria) {
        const productos = document.querySelectorAll(".producto");

        productos.forEach((producto) => {
            const nombreProducto = producto.querySelector("h3").textContent.toLowerCase();
            if (nombreProducto.includes(categoria)) {
                producto.style.display = "block";
            } else {
                producto.style.display = "none";
            }
        });
    }

    // ===== Búsqueda en Tiempo Real (Opcional) =====
    document.getElementById("buscador-input").addEventListener("input", function () {
        const textoBusqueda = this.value.toLowerCase();
        const productos = document.querySelectorAll(".producto");

        productos.forEach((producto) => {
            const nombreProducto = producto.querySelector("h3").textContent.toLowerCase();
            if (nombreProducto.includes(textoBusqueda)) {
                producto.style.display = "block";
            } else {
                producto.style.display = "none";
            }
        });
    });
});

// ===== Funcionalidad del Menú Hamburguesa =====
function toggleMenu() {
    const navPrincipal = document.getElementById("nav-principal");
    navPrincipal.classList.toggle("mostrar"); // Alternar la clase "mostrar"
}

// Cerrar el menú al hacer clic fuera de él
document.addEventListener("click", (event) => {
    const navPrincipal = document.getElementById("nav-principal");
    const menuHamburguesa = document.querySelector(".menu-hamburguesa");

    if (!navPrincipal.contains(event.target) && !menuHamburguesa.contains(event.target)) {
        navPrincipal.classList.remove("mostrar");
    }
});