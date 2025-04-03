

const express = require('express')
const bodyParser = require ('body-parser');
const app = express(); //biến thành method, tạo app
const port = 3000 // lưu port để chạy

app.use (bodyParser.json());

const users = [
   { name: "Mai",
    id: 1,
    age: 28
   },
   { name: "Nhi",
    id: 2,
    age: 21
   },
   { name: "Trinh",
    id: 3,
    age: 25
   }
]

app.get('/users', (req, res) => {
    let sortBy = req.query.sortBy;
    let sortedUsers = [...users].sort((a, b) => b.id - a.id); // Sắp xếp giảm dần

    if (!sortBy) {
        // Xáo trộn bằng cách đổi vị trí một số phần tử
        [sortedUsers[0], sortedUsers[1]] = [sortedUsers[1], sortedUsers[0]];
    }

    res.send(sortedUsers);
});   

app.get('/', (req, res) => {
  res.send('Hello World!') //gửi lại response trên server
})

app.get ('/users', (req, res) => {

    res.send(users);
})

app.get ('/users/:id', (req, res) => {
    let  id = parseInt (req.params.id);
    const user = users.find(user => user.id == id)
    res.send(user);
})

app.delete('/users/:id', (req, res) => {
     const id = parseInt(req.params.id);
     const userIndex = users.findIndex(user => user.id === id);
    
     if (userIndex === -1) {
     return res.status(404).send({ message: "User not found" });
    }
    
    users.splice(userIndex, 1); // Xóa user khỏi danh sách
     
    res.send({ users }); // Trả về danh sách user còn lại
    });
    

     
    
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newData = req.body;
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], ...newData };

    res.send({ users});
});



app.get ('/users/:id', (req, res) => {
    let  id = parseInt (req.params.id);
    let user = users.find(user => user.id == id);

    res.send(user);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})