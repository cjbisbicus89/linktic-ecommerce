-- Setup de base de datos para Linktic E-commerce
-- PostgreSQL 15

-- Conectar a la base de datos ecommerce
\c ecommerce;

-- Crear tablas
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO categories (name, description) VALUES 
('Electrónicos', 'Productos electrónicos y gadgets'),
('Accesorios', 'Accesorios para computadoras'),
('Libros', 'Libros y material de lectura')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, stock, category_id) VALUES 
('Laptop Gamer', 'Laptop de alto rendimiento para gaming', 1200.00, 10, 1),
('Mouse Inalámbrico', 'Mouse gaming inalámbrico RGB', 25.00, 50, 2),
('Teclado Mecánico', 'Teclado mecánico retroiluminado', 80.00, 25, 2),
('Monitor 27"', 'Monitor 4K 27 pulgadas', 300.00, 15, 1),
('Webcam HD', 'Webcam 1080p para streaming', 45.00, 30, 2),
('Libro JavaScript', 'Guía completa de JavaScript', 35.00, 100, 3),
('Libro React', 'Desarrollo web con React', 40.00, 75, 3),
('Auriculares Gaming', 'Auriculares 7.1 surround', 120.00, 20, 1)
ON CONFLICT DO NOTHING;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Mostrar datos insertados
SELECT 'Categorías creadas:' as info;
SELECT * FROM categories;

SELECT 'Productos creados:' as info;
SELECT p.*, c.name as category_name 
FROM products p 
LEFT JOIN categories c ON p.category_id = c.id;

SELECT 'Base de datos lista!' as status;
