const productos = document.getElementById('productos');

productos.addEventListener('click',(e) => {
    e.preventDefault();
    fetch('/productos')
        .then((response) => response.json())
        .then((productlist) => {
            const container = document.getElementById('productContainer');
            container.innerHTML=
            `
            <H1 class="text-center m-4">Productos</H1>
            <div id="productList" class="row justify-content-center">
            </div>
            `
            const prod = document.getElementById('productList');
            productlist.forEach(element => {
                prod.innerHTML +=
                `
                <div class="col m-2">
                    <div  class="card"  style="width: 18rem;">
                        <img src="${element.thumbnail}" class="img-fluid m-1" alt="${element.name}">
                        <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                            <p class="card-text">${element.description}</p>
                            <p class="card-text">Stock: ${element.stock}</p>
                            <p class="card-text">Precio: $${element.price}</p>
                            <a href="#" class="btn btn-primary">Agregar al carrito</a>
                        </div>
                    </div>
                </div>
                `;
            });;            
        });
});

