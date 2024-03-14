import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import bookRouter from './routes/book.route.js';
import { connect } from "./db/mongo.js";

// Configuración de dotenv
dotenv.config({ path: './config/.env' });

// Conexión a MongoDB
await connect();

// Configuración del servidor
const PORT = process.env.PORT || 3000;

// Crear servidor
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use('/books', bookRouter);

// Ruta invalidas
app.use((req, res) => {
  res.status(404).json({ message: 'Invalid Route'});
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
