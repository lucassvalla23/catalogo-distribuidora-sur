// carrito.js

document.addEventListener("DOMContentLoaded", () => {
    const carrito = []; // Array para almacenar los productos del carrito
    const contadorCarrito = document.getElementById("contador-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const botonVaciar = document.getElementById("vaciar-carrito");
    const botonVerCarrito = document.getElementById("ver-carrito");
    const divCarrito = document.getElementById("carrito");
    const botonCerrarCarrito = document.getElementById("cerrar-carrito");

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
    if (botonVerCarrito) {
        botonVerCarrito.addEventListener("click", (e) => {
            e.preventDefault();
            divCarrito.classList.toggle("mostrar"); // Alternar la clase "mostrar"
        });
    }

    // Cerrar carrito
    if (botonCerrarCarrito) {
        botonCerrarCarrito.addEventListener("click", () => {
            divCarrito.classList.remove("mostrar"); // Quitar la clase "mostrar"
        });
    }

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

            // Verificar si el producto ya está en el carrito
            const productoExistente = carrito.find((producto) => producto.nombre === nombre && producto.tipoCompra === tipoCompra);

            if (productoExistente) {
                // Si el producto ya existe, incrementar la cantidad
                productoExistente.cantidad += 1;
            } else {
                // Si el producto no existe, agregarlo al carrito con cantidad 1
                const producto = {
                    nombre,
                    tipoCompra,
                    precio,
                    cantidad: 1,
                };
                carrito.push(producto);
            }

            // Actualizar el carrito y guardar en localStorage
            actualizarCarrito();
            guardarCarrito(); // Guardar el carrito en localStorage
        });
    });

    // Vaciar carrito
    if (botonVaciar) {
        botonVaciar.addEventListener("click", () => {
            carrito.length = 0; // Vaciar el carrito
            actualizarCarrito(); // Actualizar la visualización
            localStorage.removeItem("carrito"); // Eliminar el carrito de localStorage
        });
    }

    // Función para actualizar el carrito
    function actualizarCarrito() {
        if (listaCarrito) {
            listaCarrito.innerHTML = "";
            let total = 0;

            carrito.forEach((producto, index) => {
                const li = document.createElement("li");

                // Mostrar los detalles del producto en el carrito
                li.textContent = `${producto.nombre} (${producto.tipoCompra}) - $${producto.precio} x ${producto.cantidad}`;

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
                total += producto.precio * producto.cantidad;
            });

            // Actualizar el total y el contador del carrito
            if (totalCarrito) totalCarrito.textContent = total.toFixed(2);
            if (contadorCarrito) contadorCarrito.textContent = carrito.reduce((total, producto) => total + producto.cantidad, 0);

            // Guardar el carrito en localStorage
            guardarCarrito();
        }
    }
});