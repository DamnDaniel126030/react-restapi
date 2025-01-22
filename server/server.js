const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { log } = require('console');
 
const app = express();

app.use(express.json());
app.use(cors());

const dataFilePath = path.join(__dirname, 'data.json');

const readData  = () => {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
}

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify (data, null, 2))
}

app.get("/items", (req, res) => {
    const data = readData();
    res.json(data);
});

app.get("/items/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    const data = readData();
    const item = data.find(item => item.id === itemId)
    if (item){
        res.json(item);
    }
    else {
        res.status(404).send('Item not found')
    }
});

app.post('/items', (req, res) => {
    const newProduct = req.body;
    const data = readData();
    const newId = data.length ? data[data.length - 1].id + 1 : 1;
    const productWithId = {id: newId, ...newProduct};
    data.push(productWithId);
    writeData(data);
    res.status(201).json(productWithId);
})

app.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const updatedProduct = req.body;
    const data = readData();
    const itemIndex = data.findIndex(item => item.id === itemId);
    if (itemIndex === -1){
        return res.status(404).send('Item not found')
    }
    data[itemIndex] = { id: itemId, ...updatedProduct};
    writeData(data);
    res.json(data[itemIndex]);
})

app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const data = readData();
    const itemIndex = data.findIndex(item => item.id === itemId);
    if(itemIndex === -1){
        return res.status(404).send('Item not found');
    }
    data.splice(itemIndex, 1);
    writeData(data);
    res.status(204).send('Successfully deleted');
})
 
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})