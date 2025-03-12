document.addEventListener("DOMContentLoaded", () => {
    const carrito = [];
    const contadorCarrito = document.getElementById("contador-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const botonVaciar = document.getElementById("vaciar-carrito");
    const botonVerCarrito = document.getElementById("ver-carrito");
    const divCarrito = document.getElementById("carrito");
    const botonCerrarCarrito = document.getElementById("cerrar-carrito");

    // Mostrar carrito
    botonVerCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        divCarrito.classList.remove("oculto");
    });

    // Cerrar carrito
    botonCerrarCarrito.addEventListener("click", () => {
        divCarrito.classList.add("oculto");
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
            const nombre = boton.getAttribute("data-nombre");

            // Obtener la opción de compra (unidad o caja) y su precio
            const opcionCompra = productoDiv.querySelector(".opcion-compra");
            const tipoCompra = opcionCompra.value; // "unidad" o "caja"
            const precio = parseFloat(opcionCompra.selectedOptions[0].getAttribute("data-precio"));

            // Crear el objeto del producto
            const producto = {
                nombre,
                tipoCompra,  // Agregamos el tipo de compra (unidad o caja)
                precio,
            };

            // Agregar el producto al carrito
            carrito.push(producto);

            // Actualizar el carrito
            actualizarCarrito();
        });
    });

    // Vaciar carrito
    botonVaciar.addEventListener("click", () => {
        carrito.length = 0;
        actualizarCarrito();
        
    });

    // Actualizar carrito
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
            });

            li.appendChild(botonEliminar);
            listaCarrito.appendChild(li);
            total += producto.precio;
        });

        // Actualizar el total y el contador del carrito
        totalCarrito.textContent = total.toFixed(2);
        contadorCarrito.textContent = carrito.length;
    }
});