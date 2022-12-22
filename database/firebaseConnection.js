// Conexión a la base de datos de Firebase
const firebaseConnection = () => {
    
    const admin =  require("firebase-admin");
    const serviceAccount = require("../../database/firebaaseCredentials.json");
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    
    console.log("Base Firebase conectada");
}

module.exports = firebaseConnection;