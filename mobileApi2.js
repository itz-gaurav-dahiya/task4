let express=require('express');
const {Client}=require('pg');

let app=express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin",'*');
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();
});

var port=process.env.PORT || 2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));
const client=new Client({
    user:'postgres',
    password:'gaurav@Dahiya',
    database:'postgres',
    port:'5432',
    host:'db.amfwwfhjovvvryqpgwpw.supabase.co',
    ssl:{ rejectUnauthorized:false}
});
client.connect(function(res,error){
    console.log(`Connected|||`);
})
app.get('/svr/Mobiles', function (req, res) {
    const brand = req.query.brand; // Brand should be a comma-separated string, e.g., "Apple,Samsung,Xiaomi"
    const RAM = req.query.RAM; // RAM should be a comma-separated string, e.g., "4GB,8GB"
    const ROM = req.query.ROM; // ROM should be a comma-separated string, e.g., "32GB,64GB"
    
    // const connection = mysql.createConnection(connData);
    let sql = 'SELECT * FROM products';

    client.query(sql, function (err, result) {
        if (err) {
            res.status(404).send(err.message);
        } else {
            if (brand) {
                const brandArray = brand.split(',');
                result = result.filter((product) => brandArray.includes(product.brand));
            }
            if (RAM) {
                const RAMArray = RAM.split(',');
                result = result.filter((product) => RAMArray.includes(product.ram));
            }
            if (ROM) {
                const ROMArray = ROM.split(',');
                result = result.filter((product) => ROMArray.includes(product.rom));
            }
            res.send(result);
        }
    });
});

app.get('/svr/Mobiles/brand/:brand', function (req, res) {
    let brand = req.params.brand;
    // let connection = mysql.createConnection(connData);
    let sql = 'SELECT * FROM productss WHERE brand = ?';
    
    client.query(sql, [brand], function (err, result) {
        if (err) {
            res.status(404).send(err.message);
        } else {
            res.send(result);
        }
    });
});

app.get('/svr/Mobiles/RAM/:RAM', function (req, res) {
    let RAM = req.params.RAM;
    // let connection = mysql.createConnection(connData);
    let sql = 'SELECT * FROM productss WHERE ram = ?';
    
    client.query(sql, [RAM], function (err, result) {
        if (err) {
            res.status(404).send(err.message);
        } else {
            res.send(result);
        }
    });
});

app.get('/svr/Mobiles/ROM/:ROM', function (req, res) {
    let ROM = req.params.ROM;
    // let connection = mysql.createConnection(connData);
    let sql = 'SELECT * FROM productss WHERE rom = ?';
    
    client.query(sql, [ROM], function (err, result) {
        if (err) {
            res.status(404).send(err.message);
        } else {
            res.send(result);
        }
    });
});

app.get('/svr/Mobiles/OS/:OS', function (req, res) {
    let OS = req.params.OS;
    // let connection = mysql.createConnection(connData);
    let sql = 'SELECT * FROM productss WHERE OS = ?';
    
    client.query(sql, [OS], function (err, result) {
        if (err) {
            res.status(404).send(err.message);
        } else {
            res.send(result);
        }
    });
});


app.post('/svr/Mobiles', function (req, res) {
    let {name,price, brand, ram, rom, os} = req.body;
    // let connection = mysql.createConnection(connData);

    // Assuming 'productss' is the name of the table in your database
    let sql = 'INSERT INTO productss (name, price, brand, ram, rom, os) VALUES (?, ?, ?, ?, ?, ?)';
    let values = [name, price, brand, ram, rom, os];

    client.query(sql, values, function (err, result) {
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.status(201).send('Mobile added successfully.');
        }
    });

   
});


app.get('/svr/Mobile/:id', function (req, res) {
    let id = req.params.id;
    // let connection = mysql.createConnection(connData);
    let sql = 'SELECT * FROM productss WHERE id = ?';

    client.query(sql, [id], function (err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send(result[0]) // Sending the retrieved product data
        }
    });
});

app.put('/svr/Mobile/:id', function (req, res) {
    let id = req.params.id;
    let { name, price, brand, ram, rom, os } = req.body;
    // let connection = mysql.createConnection(connData);

    // Assuming 'productss' is the name of the table in your database
    let sql = 'UPDATE productss SET name = ?, price = ?, brand = ?, ram = ?, rom = ?, os = ? WHERE id = ?';
    let values = [name, price, brand, ram, rom, os, id];

    client.query(sql, values, function (err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Mobile updated successfully.');
        }
    });
});



app.delete('/svr/Mobile/:id', function (req, res) {
    let id = req.params.id;
    // let connection = mysql.createConnection(connData);
    let sql = 'DELETE FROM productss WHERE id = ?';

    client.query(sql, [id], function (err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Mobile deleted successfully.');
        }
    });
});
