const express = require ('express');
const { graphqlHTTP } = require ('express-graphql');
const { buildSchema } = require ('graphql');

const Contenedor = require('./models/ProductContenedorMongoDB');
const productContenedorMongoDB = new Contenedor();

const def = 
`
    type producto {
        title: String,
        _id: ID,
        price: Float,
        thumbnail: String,
        Stock: Int,
    }

    type delete {
        error: String,
    }

    input productoInput {
        title: String!,
        price: Float!,
        thumbnail: String!,
        Stock: Int!,    
    }

    type Query {
        getProduct(id:ID): producto,
        getAllProducts: [producto],
    }

    type Mutation {
        createProducto(data: productoInput): producto,
        deleteProducto(id: ID): delete,
    }
`;


const productSchema = buildSchema(def);

const getProduct = async ({id}) => {
    const product = await productContenedorMongoDB.getById(id);
    return product[0];
};

const getAllProducts = async () => {
    const product = await productContenedorMongoDB.getAll();
    return product;

};

const createProducto = async ({data}) => {
    const product = await productContenedorMongoDB.save(data)
    return product;
};

const deleteProducto = async ({id}) => {
    const product = await productContenedorMongoDB.deleteById(id);
    console.log(product);
    return product;
}

const app = express ();

app.use('/graphql', graphqlHTTP(
    {
        schema: productSchema,
        rootValue: {
            getProduct,
            getAllProducts,
            createProducto,
            deleteProducto,
        },
        graphiql: true,
    }
));

app.listen(4040, () => console.log('Conectado para GraphQL'));