const express = require('express')
const fs = require ('fs'); //
const path = require ('path');
const app = express(); //biến thành method, tạo app
const port = 3000 // lưu port để chạy

app.use (express.json());

const usersFilePath = path.join(__dirname, 'users.json');

function readUsersFromFile(){
    try{
        const data = fs. readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error){
        return []; //file ko tồn tại trả về ds rỗng
    }
}

function writeUsersToFile (users){
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

app.get('/', (req, res) => {
    res.send('Hello World!') //gửi lại response trên server
  })

// Lấy danh sách người dùng có hỗ trợ sắp xếp
app.get('/users', (req, res) => {
    let users = readUsersFromFile();
    const sortBy = req.query.sortBy;

    if (sortBy === 'asc'){
        users.sort((a,b) => a.id - b.id); // sắp xếp tăng dần theo ID
    } else if (sortBy === 'desc'){
        users.sort((a,b) => b.id - a.id);
    }

    res.send(users);
});   

// Lấy thông tin chi tiết người dùng
app.get ('/users/:id', (req, res) => {
    let  id = parseInt (req.params.id);
    let users = readUsersFromFile();
    const user = users.find(user =>user.id === id);

    if(!user){
        return res.status(404).send({message: "User not found!"});
    }
    res.send(user);
})

//Thêm người dùng mới
app.post ('/users', (req, res) => {
    let users = readUsersFromFile();
    const newUser = req.body;

    if (!newUser.name || !newUser.age){
        return res.status(404).send({message: "Missing name of age"})
    }

    newUser.id = users.length ? Math.max(...users.map(u => u.id)) +1 :1;
    users.push(newUser);
    writeUsersToFile(users);

    res.status(201).send(newUser);
});

//Sửa thông tin người dùng
app.put('/users/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let users = readUsersFromFile();
    const newData = req.body;
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], ...newData };
    writeUsersToFile(users);

    res.send(users[userIndex]);
});

//Xóa thông tin người dùng
app.delete('/users/:id', (req, res) => {
     let id = parseInt(req.params.id);
     let users = readUsersFromFile();
     const userIndex = users.findIndex(user => user.id === id);
    
     if (userIndex === -1) {
     return res.status(404).send({ message: "User not found" });
    }
    
    users.splice(userIndex, 1); // Xóa user khỏi danh sách
    writeUsersToFile(users);
     
    res.send(users); // Trả về danh sách user còn lại
    });
    
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})