const axios = require ('axios');

const getProducts = async () => {
    try {
        const response =  await axios.get("http://localhost:8080/mongo/products");
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
};

const getProductById = async () => {
    try {
        const response =  await axios.get("http://localhost:8080/mongo/products/63a27d708b46d692f6d4a1ce");
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
};

const postProduct = async () => {
    try {
        const response =  await axios.post("http://localhost:8080/mongo/products",
        {
            title: 'Lychee',
            price: 2860,
            thumbnail: 'https://cdn-icons-png.flaticon.com/512/7010/7010276.png',
            Stock: 35,
        });
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
};

const updateProductById = async () => {
    try {
        const producto =  await axios.get("http://localhost:8080/mongo/products");
        let id = ""
        if (producto.data.find(producto => producto.title === "Lychee")) {
            id = producto.data.find(producto => producto.title === "Lychee")._id
        } else {
            id =123;
        };
        const response =  await axios.put(`http://localhost:8080/mongo/products/${id}`,
        {
            Stock:0,
        });
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
};

const deleteProductById = async () => {
    try {
        const producto =  await axios.get("http://localhost:8080/mongo/products");
        let id = ""
        if (producto.data.find(producto => producto.title === "Lychee")) {
            id = producto.data.find(producto => producto.title === "Lychee")._id
        } else {
            id =123;
        };
        const response =  await axios.delete(`http://localhost:8080/mongo/products/${id}`);
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
};



postProduct();
getProductById();
deleteProductById();
updateProductById();
getProducts();