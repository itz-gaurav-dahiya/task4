const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const client = new Client({
    user: 'postgres', // Change to your PostgreSQL username
    password: 'gaurav@Dahiya', // Change to your PostgreSQL password
    database: 'postgres', // Change to your PostgreSQL database name
    port: 5432,
    host: 'db.amfwwfhjovvvryqpgwpw.supabase.co', // Change to your PostgreSQL database host
    ssl: { rejectUnauthorized: false }
});

client.connect(); // Connect without passing callback

app.get('/svr/Mobiles', function (req, res) {
    const brand = req.query.brand;
    const RAM = req.query.RAM;
    const ROM = req.query.ROM;

    let sql = 'SELECT * FROM products';

    client.query(sql, (err, result) => { // Use an arrow function
        if (err) {
            res.status(404).send(err.message);
        } else {
            if (brand) {
                const brandArray = brand.split(',');
                result.rows = result.rows.filter((product) => brandArray.includes(product.brand));
            }
            if (RAM) {
                const RAMArray = RAM.split(',');
                result.rows = result.rows.filter((product) => RAMArray.includes(product.ram));
            }
            if (ROM) {
                const ROMArray = ROM.split(',');
                result.rows = result.rows.filter((product) => ROMArray.includes(product.rom));
            }
            res.send(result.rows);
        }
    });
});

app.get('/svr/Mobiles/brand/:brand', function (req, res) {
    let brand = req.params.brand;
    let sql = 'SELECT * FROM products WHERE brand = $1'; // Use parameterized query

    client.query(sql, [brand], (err, result) => { // Use an arrow function
        if (err) {
            res.status(404).send(err.message);
        } else {
            res.send(result.rows); // Send the rows from the result
        }
    });
});

app.get('/svr/Mobiles/RAM/:RAM', function (req, res) {
    let RAM = req.params.RAM; // Get the RAM value from the URL
    let sql = 'SELECT * FROM products WHERE ram = $1'; // Use parameterized query

    client.query(sql, [RAM], (err, result) => { // Use an arrow function
        if (err) {
            res.status(404).send(err.message);
        } else {
            res.send(result.rows); // Send the rows from the result
        }
    });
});

app.get('/svr/Mobiles/ROM/:ROM', function (req, res) {
    let ROM = req.params.ROM; // Get the ROM value from the URL
    let sql = 'SELECT * FROM products WHERE rom = $1'; // Use parameterized query

    client.query(sql, [ROM], (err, result) => { // Use an arrow function
        if (err) {
            res.status(404).send(err.message);
        } else {
            res.send(result.rows); // Send the rows from the result
        }
    });
});

app.get('/svr/Mobiles/OS/:OS', function (req, res) {
    let OS = req.params.OS; // Get the OS value from the URL
    let sql = 'SELECT * FROM products WHERE os = $1'; // Use parameterized query

    client.query(sql, [OS], (err, result) => { // Use an arrow function
        if (err) {
            res.status(404).send(err.message);
        } else {
            res.send(result.rows); // Send the rows from the result
        }
    });
});

app.post('/svr/Mobiles', function (req, res) {
    let { name, price, brand, ram, rom, os } = req.body;
    let sql = 'INSERT INTO products (name, price, brand, ram, rom, os) VALUES ($1, $2, $3, $4, $5, $6)'; // Use parameterized query
    let values = [name, price, brand, ram, rom, os];

    client.query(sql, values, (err, result) => { // Use an arrow function
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.status(201).send('Mobile added successfully.');
        }
    });
});

app.get('/svr/Mobile/:id', function (req, res) {
    let id = req.params.id;
    let sql = 'SELECT * FROM products WHERE id = $1'; // Use parameterized query

    client.query(sql, [id], (err, result) => { // Use an arrow function
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send(result.rows[0]); // Sending the retrieved product data
        }
    });
});

app.put('/svr/Mobile/:id', function (req, res) {
    let id = req.params.id;
    let { name, price, brand, ram, rom, os } = req.body;
    let sql = 'UPDATE products SET name = $1, price = $2, brand = $3, ram = $4, rom = $5, os = $6 WHERE id = $7'; // Use parameterized query
    let values = [name, price, brand, ram, rom, os, id];

    client.query(sql, values, (err, result) => { // Use an arrow function
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Mobile updated successfully.');
        }
    });
});

app.delete('/svr/Mobile/:id', function (req, res) {
    let id = req.params.id;
    let sql = 'DELETE FROM products WHERE id = $1'; // Use parameterized query

    client.query(sql, [id], (err, result) => { // Use an arrow function
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Mobile deleted successfully.');
        }
    });
});
