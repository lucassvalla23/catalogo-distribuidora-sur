document.addEventListener("DOMContentLoaded", () => {
    const carrito = [];
    const contadorCarrito = document.getElementById("contador-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const botonVaciar = document.getElementById("vaciar-carrito");
    const botonVerCarrito = document.getElementById("ver-carrito");
    const divCarrito = document.getElementById("carrito");
    const botonCerrarCarrito = document.getElementById("cerrar-carrito");

    // Función para filtrar productos por nombre
    function filtrarProductos() {
        const input = document.getElementById("buscador-input").value.toLowerCase(); // Texto del buscador
        const productos = document.querySelectorAll(".producto"); // Todos los productos

        productos.forEach((producto) => {
            const nombre = producto.querySelector("h3").textContent.toLowerCase(); // Nombre del producto
            if (nombre.includes(input)) {
                producto.style.display = "block"; // Muestra el producto si coincide
            } else {
                producto.style.display = "none"; // Oculta el producto si no coincide
            }
        });
    }

    // Evento para el botón de búsqueda
    document.getElementById("boton-buscar").addEventListener("click", filtrarProductos);

    // Evento para buscar mientras se escribe (opcional)
    document.getElementById("buscador-input").addEventListener("input", filtrarProductos);

    // Función para filtrar por "Gomita"
    function filtrarPorGomita() {
        const productos = document.querySelectorAll(".producto");
        productos.forEach((producto) => {
            const nombre = producto.querySelector("h3").textContent.toLowerCase();
            if (nombre.startsWith("gomita")) {
                producto.style.display = "block";
            } else {
                producto.style.display = "none";
            }
        });
    }

    // Función para filtrar por "Regaliz"
    function filtrarPorRegaliz() {
        const productos = document.querySelectorAll(".producto");
        productos.forEach((producto) => {
            const nombre = producto.querySelector("h3").textContent.toLowerCase();
            if (nombre.startsWith("regaliz")) {
                producto.style.display = "block";
            } else {
                producto.style.display = "none";
            }
        });
    }

    // Evento para el botón de filtrar por "Gomita"
    document.getElementById("filtro-gomita").addEventListener("click", filtrarPorGomita);

    // Evento para el botón de filtrar por "Regaliz"
    document.getElementById("filtro-regaliz").addEventListener("click", filtrarPorRegaliz);

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
    
    function toggleMenu() {
        const nav = document.getElementById('nav-principal');
        nav.classList.toggle('mostrar'); // Agrega o quita la clase "mostrar"
    }


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