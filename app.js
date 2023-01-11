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
        
        //Pintar productos en pantalla
        data.forEach ((producto) => {
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
            
            const modalVaciarCarrito = document.createElement ("h3");
            modalVaciarCarrito.className = "modal-vaciar-carrito";
            modalVaciarCarrito.innerText = "(Vaciar Carrito)";
            modal.append (modalVaciarCarrito);

            if (carrito.length === 0){
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
            
            const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
            const totalCompra = document.createElement ("div");
            totalCompra.className = "total-content";
            totalCompra.innerHTML = `Total a pagar: $ ${total}`;
            modal.append (totalCompra);

            const comprar = document.createElement ("button");
            comprar.className = "comprar";
            comprar.innerText = "comprar";
            modal.append (comprar);
            
        };
        
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
