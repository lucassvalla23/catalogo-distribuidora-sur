document.addEventListener("DOMContentLoaded", () => {
    // Array para almacenar los productos del carrito
    const carrito = []; 

    // Selección de elementos del DOM con verificaciones
    const elementosCarrito = {
        contador: document.getElementById("contador-carrito"),
        lista: document.getElementById("lista-carrito"),
        total: document.getElementById("total-carrito"),
        botonVaciar: document.getElementById("vaciar-carrito"),
        botonVer: document.getElementById("ver-carrito"),
        divCarrito: document.getElementById("carrito"),
        botonCerrar: document.getElementById("cerrar-carrito"),
        botonPagar: document.getElementById("boton-pagar"),
        botonWhatsApp: document.getElementById("enviar-whatsapp")
    };

    // Verificar que los elementos esenciales existen
    if (!elementosCarrito.divCarrito || !elementosCarrito.botonVer || !elementosCarrito.lista) {
        console.error("Error: Elementos esenciales del carrito no encontrados");
        return;
    }

    // ===== Configuración de Mercado Pago =====
    const mp = new MercadoPago("APP_USR-c636cfaa-8a31-4584-892d-32d5ca3a2028", {
        locale: "es-AR"
    });

    // ===== Funciones básicas del carrito =====
    function guardarCarrito() {
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function cargarCarrito() {
        const carritoGuardado = sessionStorage.getItem("carrito");
        if (carritoGuardado) {
            carrito.length = 0;
            carrito.push(...JSON.parse(carritoGuardado));
            actualizarCarrito();
        }
    }

    // ===== Funcionalidad de WhatsApp =====
    if (elementosCarrito.botonWhatsApp) {
        elementosCarrito.botonWhatsApp.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("El carrito está vacío. Agrega productos antes de enviar.");
                return;
            }
            
            let mensaje = "Hola, me gustaría hacer el siguiente pedido:\n\n";
            
            carrito.forEach((producto) => {
                mensaje += `- ${producto.nombre}`;
                
                if (Object.keys(producto.variantes).length > 0) {
                    mensaje += ` (${formatearVariantes(producto.variantes)})`;
                }
                
                mensaje += ` - ${producto.cantidad} ${producto.tipoCompra}(s)`;
                mensaje += ` - $${producto.precio.toFixed(2)}\n`;
            });
            
            mensaje += `\nTotal: $${calcularTotalCarrito().toFixed(2)}\n`;
            mensaje += "Por favor confírmame disponibilidad y total final.\n¡Gracias!";
            
            const telefonoMayorista = "5493465658349";
            window.open(`https://wa.me/${telefonoMayorista}?text=${encodeURIComponent(mensaje)}`, '_blank');
        });
    }

    // ===== Eventos del carrito =====
    elementosCarrito.botonVer.addEventListener("click", (e) => {
        e.preventDefault();
        elementosCarrito.divCarrito.classList.toggle("mostrar");
    });

    elementosCarrito.botonCerrar.addEventListener("click", () => {
        elementosCarrito.divCarrito.classList.remove("mostrar");
    });

    if (elementosCarrito.botonVaciar) {
        elementosCarrito.botonVaciar.addEventListener("click", () => {
            carrito.length = 0;
            actualizarCarrito();
            sessionStorage.removeItem("carrito");
        });
    }

    // ===== Funciones auxiliares =====
    function obtenerVariantes(productoDiv) {
        const variantes = {};
        const selectsVariantes = productoDiv.querySelectorAll('.opcion-tipo, .opcion-variante');
        
        selectsVariantes.forEach(select => {
            const nombreVariante = select.getAttribute('data-variante') || 
                                 select.id.replace('tipo-', '').replace('tipo-', '') || 
                                 'tipo';
            variantes[nombreVariante] = select.value;
        });
        
        return variantes;
    }

    function formatearVariantes(variantes) {
        return Object.entries(variantes)
            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            .join(', ');
    }

    function generarIdProducto(nombre, tipoCompra, variantes) {
        const variantesStr = Object.values(variantes).join('-');
        return `${nombre}-${tipoCompra}-${variantesStr}`.toLowerCase().replace(/\s+/g, '-');
    }

    // ===== Agregar productos al carrito =====
    document.querySelectorAll(".agregar-carrito").forEach((boton) => {
        boton.addEventListener("click", () => {
            if (boton.disabled) {
                alert("Este producto no tiene stock disponible.");
                return;
            }

            // Animación de confirmación
            boton.classList.add("animacion-checkmark");
            setTimeout(() => boton.classList.remove("animacion-checkmark"), 1000);

            const productoDiv = boton.closest(".producto");
            if (!productoDiv) {
                console.error("No se encontró el contenedor del producto");
                return;
            }

            const nombre = boton.getAttribute("data-nombre");
            const opcionCompra = productoDiv.querySelector(".opcion-compra");
            
            if (!opcionCompra) {
                console.error("Selector de opción de compra no encontrado");
                return;
            }

            const tipoCompra = opcionCompra.value;
            const precio = parseFloat(opcionCompra.selectedOptions[0].getAttribute("data-precio"));
            const variantes = obtenerVariantes(productoDiv);

            const producto = {
                nombre,
                tipoCompra,
                precio,
                variantes,
                id: generarIdProducto(nombre, tipoCompra, variantes),
                cantidad: 1
            };

            const productoExistente = carrito.find(item => item.id === producto.id);

            if (productoExistente) {
                productoExistente.cantidad += 1;
                productoExistente.precio += producto.precio;
            } else {
                carrito.push(producto);
            }

            actualizarCarrito();
        });
    });

    // ===== Actualización del carrito =====
    function actualizarCarrito() {
        if (!elementosCarrito.lista || !elementosCarrito.total || !elementosCarrito.contador) {
            console.error("Elementos de visualización del carrito no encontrados");
            return;
        }

        elementosCarrito.lista.innerHTML = "";
        let total = 0;

        carrito.forEach((producto, index) => {
            const li = document.createElement("li");
            let textoProducto = `${producto.nombre}`;
            
            if (Object.keys(producto.variantes).length > 0) {
                textoProducto += ` (${formatearVariantes(producto.variantes)})`;
            }
            
            if (producto.cantidad > 1) {
                textoProducto += ` x${producto.cantidad}`;
            }
            
            textoProducto += ` - ${producto.tipoCompra} - $${producto.precio.toFixed(2)}`;
            li.textContent = textoProducto;

            const botonEliminar = document.createElement("button");
            botonEliminar.classList.add("eliminar-producto");
            botonEliminar.innerHTML = `<i class="fas fa-trash-alt"></i> Eliminar`;
            botonEliminar.addEventListener("click", () => {
                carrito.splice(index, 1);
                actualizarCarrito();
                guardarCarrito();
            });

            li.appendChild(botonEliminar);
            elementosCarrito.lista.appendChild(li);
            total += producto.precio;
        });

        elementosCarrito.total.textContent = total.toFixed(2);
        elementosCarrito.contador.textContent = carrito.reduce((sum, producto) => sum + producto.cantidad, 0);
        guardarCarrito();
    }

    // ===== Pago con Mercado Pago =====
    if (elementosCarrito.botonPagar) {
        elementosCarrito.botonPagar.addEventListener("click", async () => {
            try {
                const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer APP_USR-4538737680093787-031821-2da7e0652bd06c6e801427d001fe251b-343458851",
                    },
                    body: JSON.stringify({
                        items: [{
                            title: "Compra en Distribuidora Sur",
                            quantity: 1,
                            unit_price: calcularTotalCarrito(),
                        }],
                        back_urls: {
                            success: "http://127.0.0.1:5500/exito.html",
                            failure: "http://127.0.0.1:5500/error.html",
                            pending: "http://127.0.0.1:5500/pendiente.html",
                        },
                        auto_return: "approved",
                    }),
                });

                const preference = await response.json();
                window.location.href = preference.init_point;
            } catch (error) {
                console.error("Error al generar el pago:", error);
                alert("Hubo un error al procesar el pago. Inténtalo de nuevo.");
            }
        });
    }

    function calcularTotalCarrito() {
        return carrito.reduce((total, producto) => total + producto.precio, 0);
    }

    // ===== Funcionalidad del Buscador =====
    const buscadorInput = document.getElementById("buscador-input");
    if (buscadorInput) {
        buscadorInput.addEventListener("input", function() {
            const textoBusqueda = this.value.toLowerCase();
            document.querySelectorAll(".producto").forEach((producto) => {
                const nombreProducto = producto.querySelector("h3")?.textContent.toLowerCase() || "";
                producto.style.display = nombreProducto.includes(textoBusqueda) ? "block" : "none";
            });
        });
    }

    // ===== Funcionalidad de Filtrado =====
    document.getElementById("filtro-gomita")?.addEventListener("click", () => filtrarProductos("gomita"));
    document.getElementById("filtro-regaliz")?.addEventListener("click", () => filtrarProductos("regaliz"));

    function filtrarProductos(categoria) {
        document.querySelectorAll(".producto").forEach((producto) => {
            const nombreProducto = producto.querySelector("h3")?.textContent.toLowerCase() || "";
            producto.style.display = nombreProducto.includes(categoria) ? "block" : "none";
        });
    }

    // Cargar el carrito al iniciar
    window.addEventListener("pageshow", cargarCarrito);
    cargarCarrito();
});

// ===== Menú Hamburguesa =====
function toggleMenu() {
    const navPrincipal = document.getElementById("nav-principal");
    navPrincipal?.classList.toggle("mostrar");
}

document.addEventListener("click", (event) => {
    const navPrincipal = document.getElementById("nav-principal");
    const menuHamburguesa = document.querySelector(".menu-hamburguesa");
    
    if (navPrincipal && menuHamburguesa) {
        if (!navPrincipal.contains(event.target) && !menuHamburguesa.contains(event.target)) {
            navPrincipal.classList.remove("mostrar");
        }
    }
});