//Base de datos
const fetchShop = async () => {
    try {
        const response = await fetch ("./data.json");
        const data = await response.json ();
        
        //Variables
        let carrito = JSON.parse (localStorage.getItem ("carrito")) || [];
        const shopContent = document.querySelector (".shop-content");
        const verCarrito = document.querySelector ('.verCarrito');
        const modal = document.querySelector ('.modal-container');
        const cantidadCarrito = document.querySelector ('.notificacionCarrito');
        const modalContacto = document.querySelector ("#modal-contacto");
        
        //Pintar productos en pantalla
        data.forEach ((producto) => {
            modalContacto.style.display = "none";
            let content = document.createElement ("div");
            content.className = "card";
            content.innerHTML = `
            <img src = "${producto.img}">
            <h3>${producto.nombre}</h3>
            <p class = "price">$ ${producto.precio}</p>
            `;
            shopContent.append (content);
            
            let agregar = document.createElement ("button");
            agregar.className = "agregar";
            agregar.innerText = "agregar";
            content.append (agregar);
            
            agregar.addEventListener ("click", () => {
                const repetido = carrito.some ((productoRepetido) => productoRepetido.id === producto.id);
                if (repetido){
                    carrito.map ((prod) => {
                        if (prod.id === producto.id){
                            prod.cantidad++;
                        };
                    });
                }else{
                    carrito.push ({
                        id: producto.id,
                        img: producto.img,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        cantidad: producto.cantidad,
                    });
                };
                Toastify({
                    text: "Agregaste un producto al carrito",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
                contadorCarrito ();
                guardarLocal ();
            });
        });
        
        //Pintar carrito
        const pintarCarrito = () => {
            modal.innerHTML = "";
            modal.style.display = "flex";
            
            const modalHeader = document.createElement ("div");
            modalHeader.className = "modal-header";
            modalHeader.innerHTML = `<h1 class = "modal-header-title">Carrito</h1>`;
            modal.append (modalHeader);
            
            const modalBorrar = document.createElement ("h2");
            modalBorrar.className = "modal-header-button";
            modalBorrar.innerText = "X";
            modalHeader.append (modalBorrar);
            
            modalBorrar.addEventListener ("click", () => {
                modal.style.display = "none";        
            });
            
            //Eliminar todos los productos del carrito
            const modalVaciarCarrito = document.createElement ("h3");
            modalVaciarCarrito.className = "modal-vaciar-carrito";
            modalVaciarCarrito.innerText = "(Vaciar Carrito)";
            modal.append (modalVaciarCarrito);

            if (!carrito.length){
                const modalCarritoVacio = document.createElement ("h3");
                modalCarritoVacio.className = "modal-carrito-vacio";
                modalCarritoVacio.innerText = "Carrito Vacio";
                modal.append (modalCarritoVacio);                
                modalVaciarCarrito.style.display = "none";
            };            
            
            modalVaciarCarrito.addEventListener ("click", () => {
                carrito = [];
                guardarLocal ();
                contadorCarrito ();
                pintarCarrito ();
            });
            
            carrito.forEach ((producto) => {
                let contenidoCarrito = document.createElement ("div");
                contenidoCarrito.className = "modal-content";
                contenidoCarrito.innerHTML = `
                <img src = "${producto.img}">
                <h3>${producto.nombre} </h3>
                <p>$ ${Number (producto.precio)} </p>
                <p>Cantidad: ${producto.cantidad}</p>
                <span class = "borrar-producto">X</span>
                `;
                modal.append (contenidoCarrito);
                
                let eliminar = contenidoCarrito.querySelector (".borrar-producto");
                
                eliminar.addEventListener ("click", () => {
                    eliminarProducto (producto.id);
                });
            });    
            
            //Suma del total del carrito
            const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
            const totalCompra = document.createElement ("div");
            totalCompra.className = "total-content";
            totalCompra.innerHTML = `Total a pagar: $ ${total}`;
            modal.append (totalCompra);

            //Boton comprar
            const comprar = document.createElement ("button");
            comprar.className = "comprar";
            comprar.innerText = "comprar";
            modal.append (comprar);

            //Evento de compra
            comprar.addEventListener ("click", datos);

            if (!carrito.length) {
                comprar.style.display = "none";
            };
            
        };
        
        //Modal con formulario para culminar la compra
        const datos = () => {
            modal.style.display = "none";
            modalContacto.style.display = "flex";

        };
        //Variable con el elemento del DOM
        let nombreForm = document.querySelector("#nombre");
        let correoForm = document.querySelector("#correo");

        //Eventos
        nombreForm.addEventListener("input", function () {
        if (nombreForm.value === "") {
        alert ("Ingrese un nombre válido");
        }
        });

        correoForm.addEventListener("input", function () {
        if (correoForm.value === "") {
        alert ("Ingrese un correo electrónico válido");
        }
        });

        let formulario = document.querySelector("#formulario");

        let info = document.querySelector(".info");

        //Agregar informacion al DOM
        const pintarInfo = formulario.addEventListener("submit", function (e) {
            e.preventDefault();
            modalContacto.style.display = "none";
            Swal.fire({
                title: `Muchas gracias ${nombreForm.value} por tu compra, te responderemos a ${correoForm.value} para concretar detalles de tu compra.`,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
            carrito = [];
            guardarLocal ();
            contadorCarrito ();
        });

        verCarrito.addEventListener (("click"), pintarCarrito);
        
        const eliminarProducto = (id) => {
            const encontrarId = carrito.find ((elemento) => elemento.id === id);
            carrito = carrito.filter ((carritoId) => {
                return carritoId !== encontrarId;
            });
            contadorCarrito ();
            guardarLocal ();
            pintarCarrito ();
        };
        
        const contadorCarrito = () => {
            cantidadCarrito.style.display = "block";
            const numeroCarrito = carrito.length;
            localStorage.setItem ("numeroCarrito", JSON.stringify (numeroCarrito));
            cantidadCarrito.innerText = JSON.parse (localStorage.getItem ("numeroCarrito"));
        };
        
        const guardarLocal = () => {
            localStorage.setItem ("carrito", JSON.stringify (carrito));
        };
        
        contadorCarrito ();        

    } catch (error) {
        console.log (error);
    };
};
fetchShop ();
