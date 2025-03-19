document.addEventListener("DOMContentLoaded", () => {
    const carrito = []; // Array para almacenar los productos del carrito
    const contadorCarrito = document.getElementById("contador-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const botonVaciar = document.getElementById("vaciar-carrito");
    const botonVerCarrito = document.getElementById("ver-carrito");
    const divCarrito = document.getElementById("carrito");
    const botonCerrarCarrito = document.getElementById("cerrar-carrito");

    // ===== Configuración de Mercado Pago =====
    const mp = new MercadoPago("APP_USR-c636cfaa-8a31-4584-892d-32d5ca3a2028", {
        locale: "es-AR", // Configura el idioma
    });

    // ===== Funcionalidad del carrito =====

    // Función para guardar el carrito en localStorage
    function guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // Función para cargar el carrito desde localStorage
    function cargarCarrito() {
        const carritoGuardado = localStorage.getItem("carrito");
        if (carritoGuardado) {
            carrito.length = 0; // Vaciar el carrito actual
            carrito.push(...JSON.parse(carritoGuardado)); // Cargar el carrito guardado
            actualizarCarrito(); // Actualizar la visualización del carrito
        }
    }

    // Cargar el carrito al iniciar la página
    cargarCarrito();

    // Mostrar carrito
    botonVerCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        divCarrito.classList.toggle("mostrar"); // Alternar la clase "mostrar"
    });

    // Cerrar carrito
    botonCerrarCarrito.addEventListener("click", () => {
        divCarrito.classList.remove("mostrar"); // Quitar la clase "mostrar"
    });

    // Agregar productos al carrito
    document.querySelectorAll(".agregar-carrito").forEach((boton) => {
        boton.addEventListener("click", () => {
            // Verificar si el botón está deshabilitado (sin stock)
            if (boton.disabled) {
                alert("Este producto no tiene stock disponible.");
                return;
            }

            // Cambiar temporalmente el ícono a un checkmark
            boton.classList.add("animacion-checkmark");

            // Restaurar el ícono original después de 1 segundo
            setTimeout(() => {
                boton.classList.remove("animacion-checkmark");
            }, 1000);

            // Obtener los datos del producto
            const productoDiv = boton.closest(".producto");
            const nombre = boton.getAttribute("data-nombre"); // Nombre del producto

            // Obtener la opción de compra (unidad o caja) y su precio
            const opcionCompra = productoDiv.querySelector(".opcion-compra");
            const tipoCompra = opcionCompra.value; // "unidad" o "caja"
            const precio = parseFloat(opcionCompra.selectedOptions[0].getAttribute("data-precio"));

            // Crear el objeto del producto
            const producto = {
                nombre,
                tipoCompra,
                precio,
            };

            // Agregar el producto al carrito
            carrito.push(producto);

            // Actualizar el carrito y guardar en localStorage
            actualizarCarrito();
        });
    });

    // Vaciar carrito
    botonVaciar.addEventListener("click", () => {
        carrito.length = 0; // Vaciar el carrito
        actualizarCarrito(); // Actualizar la visualización
        localStorage.removeItem("carrito"); // Eliminar el carrito de localStorage
    });

    // Función para actualizar el carrito
    function actualizarCarrito() {
        listaCarrito.innerHTML = "";
        let total = 0;

        carrito.forEach((producto, index) => {
            const li = document.createElement("li");

            // Mostrar los detalles del producto en el carrito
            li.textContent = `${producto.nombre} (${producto.tipoCompra}) - $${producto.precio}`;

            // Botón para eliminar producto del carrito
            const botonEliminar = document.createElement("button");
            botonEliminar.classList.add("eliminar-producto");
            botonEliminar.innerHTML = `<i class="fas fa-trash-alt"></i> Eliminar`;
            botonEliminar.addEventListener("click", () => {
                carrito.splice(index, 1); // Eliminar el producto del carrito
                actualizarCarrito(); // Actualizar la visualización del carrito
                guardarCarrito(); // Guardar el carrito en localStorage
            });

            li.appendChild(botonEliminar);
            listaCarrito.appendChild(li);
            total += producto.precio;
        });

        // Actualizar el total y el contador del carrito
        totalCarrito.textContent = total.toFixed(2);
        contadorCarrito.textContent = carrito.length;

        // Guardar el carrito en localStorage
        guardarCarrito();
    }

    // ===== Funcionalidad de pago con Mercado Pago =====

    // Botón de pago
    const botonPagar = document.getElementById("boton-pagar");

    botonPagar.addEventListener("click", async () => {
        try {
            // Crear un objeto de preferencia de pago
            const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer APP_USR-4538737680093787-031821-2da7e0652bd06c6e801427d001fe251b-343458851", // Usa tu Access Token
                },
                body: JSON.stringify({
                    items: [
                        {
                            title: "Compra en Distribuidora Sur", // Nombre del producto o servicio
                            quantity: 1,
                            unit_price: calcularTotalCarrito(), // Total del carrito
                        },
                    ],
                    back_urls: {
                        success: "exito.html", // URL de éxito
                        failure: "https://tupagina.com/error", // URL de error
                        pending: "https://tupagina.com/pendiente", // URL de pago pendiente
                    },
                    auto_return: "approved", // Redirigir automáticamente después del pago
                }),
            });

            const preference = await response.json();

            // Redirigir al cliente a Mercado Pago
            window.location.href = preference.init_point;
        } catch (error) {
            console.error("Error al generar el pago:", error);
            alert("Hubo un error al procesar el pago. Inténtalo de nuevo.");
        }
    });

    // Función para calcular el total del carrito
    function calcularTotalCarrito() {
        return carrito.reduce((total, producto) => total + producto.precio, 0);
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