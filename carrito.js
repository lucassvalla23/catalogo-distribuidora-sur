document.addEventListener("DOMContentLoaded", () => {
    const carrito = []; // Array para almacenar los productos del carrito
    const contadorCarrito = document.getElementById("contador-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const botonVaciar = document.getElementById("vaciar-carrito");
    const botonVerCarrito = document.getElementById("ver-carrito");
    const divCarrito = document.getElementById("carrito");
    const botonCerrarCarrito = document.getElementById("cerrar-carrito");

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
            divCarrito.classList.toggle("mostrar");
        });
    }

    // Cerrar carrito
    if (botonCerrarCarrito) {
        botonCerrarCarrito.addEventListener("click", () => {
            divCarrito.classList.remove("mostrar");
        });
    }

    // Agregar productos al carrito
    document.querySelectorAll(".agregar-carrito").forEach((boton) => {
        boton.addEventListener("click", () => {
            if (boton.disabled) {
                alert("Este producto no tiene stock disponible.");
                return;
            }

            boton.classList.add("animacion-checkmark");
            setTimeout(() => {
                boton.classList.remove("animacion-checkmark");
            }, 1000);

            const productoDiv = boton.closest(".producto");
            const nombre = boton.getAttribute("data-nombre");
            const opcionCompra = productoDiv.querySelector(".opcion-compra");
            const tipoCompra = opcionCompra.value;
            const precio = parseFloat(opcionCompra.selectedOptions[0].getAttribute("data-precio"));

            const productoExistente = carrito.find((producto) => producto.nombre === nombre && producto.tipoCompra === tipoCompra);

            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                const producto = {
                    nombre,
                    tipoCompra,
                    precio,
                    cantidad: 1,
                };
                carrito.push(producto);
            }

            actualizarCarrito();
            guardarCarrito();
        });
    });

    // Vaciar carrito
    if (botonVaciar) {
        botonVaciar.addEventListener("click", () => {
            carrito.length = 0;
            actualizarCarrito();
            localStorage.removeItem("carrito");
        });
    }

    // Función para actualizar el carrito
    function actualizarCarrito() {
        if (listaCarrito) {
            listaCarrito.innerHTML = "";
            let total = 0;

            carrito.forEach((producto, index) => {
                const li = document.createElement("li");
                li.textContent = `${producto.nombre} (${producto.tipoCompra}) - $${producto.precio} x ${producto.cantidad}`;

                const botonEliminar = document.createElement("button");
                botonEliminar.classList.add("eliminar-producto");
                botonEliminar.innerHTML = `<i class="fas fa-trash-alt"></i> Eliminar`;
                botonEliminar.addEventListener("click", () => {
                    carrito.splice(index, 1);
                    actualizarCarrito();
                    guardarCarrito();
                });

                li.appendChild(botonEliminar);
                listaCarrito.appendChild(li);
                total += producto.precio * producto.cantidad;
            });

            if (totalCarrito) totalCarrito.textContent = total.toFixed(2);
            if (contadorCarrito) contadorCarrito.textContent = carrito.reduce((total, producto) => total + producto.cantidad, 0);

            guardarCarrito();
        }
    }
});