const knex = require ('knex');
const mysqlConnection = require('./mysqlConnection');
const sqliteConnection = require('./sqliteConnection');

const createProductTable = async () => {
    try {
        const database = knex(mysqlConnection);
        // Se borra la tabla productos si ya existe
        await database.schema.dropTableIfExists('productos');
        // Se crea la tabla produtos
        await database.schema.createTable('productos', (table) => {
            table.increments('id').primary()
            table.string('title', 15).notNullable()
            table.float('price', 15).notNullable()
            table.string('thumbnail', 255).notNullable()  
        });

        console.log('Table productos created');
        
    } catch (error) {
        console.log('Table productos error: ', error);        
    }
};

const createMessageTable = async () => {
    try {
        const database = knex(sqliteConnection);
        await database.schema.dropTableIfExists('mensajes');

        await database.schema.createTable('mensajes', (table) => {
            table.increments('id').primary()
            table.string('author',50).notNullable()
            table.string('text',255)
            table.string('fecha',255)
        });

        console.log('Table mensajes created');
    } catch (error) {
        console.log('Table mensajes error: ',error);        
    }
};

const createTables = async () => {
    await createProductTable();
    await createMessageTable();
};

//no le hago .finally() ya que necesito que quede corriendo para que la api funcione

createTables();

