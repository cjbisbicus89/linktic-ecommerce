import express from 'express';
import { Client } from 'pg';

// Servidor Express simple que conecta a PostgreSQL
const app = express();
app.use(express.json());

// Conexión a PostgreSQL
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'products_db'
});

// Iniciar conexión
client.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL products_db'))
  .catch(err => console.error('❌ Error BD:', err));

// Endpoints
app.get('/products', async (req, res) => {
  try {
    const result = await client.query('SELECT p.*, c.name as category FROM products p JOIN categories c ON p.category_id = c.id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
const PORT = 4001;
app.listen(PORT, () => {
  console.log(`🚀 Products Service en http://localhost:${PORT}`);
  console.log(`📚 GET /products - Listar todos`);
  console.log(`📚 GET /products/:id - Obtener por ID`);
});

export default app;
