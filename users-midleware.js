import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkID } from './checkID.midleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, 'users.json');

const app = express();
const port = 3000;

app.use(express.json());

// Đọc danh sách người dùng từ file JSON
function readUsersFromFile() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return []; // Trả về danh sách rỗng nếu file không tồn tại
    }
}

// Ghi danh sách người dùng vào file JSON
function writeUsersToFile(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

// Lấy danh sách người dùng, có hỗ trợ sắp xếp
app.get('/users', (req, res) => {
    let users = readUsersFromFile();
    const sortBy = req.query.sortBy;

    if (sortBy === 'asc') {
        users.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'desc') {
        users.sort((a, b) => b.id - a.id);
    }

    res.status(200).send(users);
});

// Lấy thông tin chi tiết của một người dùng
app.get('/users/:id', checkID, (req, res) => {
    let id = parseInt(req.params.id);
    let users = readUsersFromFile();
    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).send({ message: "User not found! Please check again!" });
    }
    res.status(200).send(user);
});

// Thêm người dùng mới
app.post('/users', (req, res) => {
    let users = readUsersFromFile();
    const newUser = req.body;

    if (!newUser.name || !newUser.age) {
        return res.status(400).send({ message: "Missing name or age! Please try again!" });
    }

    newUser.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push(newUser);
    writeUsersToFile(users);

    res.status(201).send(newUser);
});

// Cập nhật thông tin người dùng
app.put('/users/:id', checkID, (req, res) => {
    let id = parseInt(req.params.id);
    let users = readUsersFromFile();
    const newData = req.body;
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).send({ message: "User not found! Try again!" });
    }

    users[userIndex] = { ...users[userIndex], ...newData };
    writeUsersToFile(users);

    res.status(200).send(users[userIndex]);
});

// Xóa người dùng
app.delete('/users/:id', checkID, (req, res) => {
    let id = parseInt(req.params.id);
    let users = readUsersFromFile();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).send({ message: "User not found! Try again!" });
    }

    users.splice(userIndex, 1);
    writeUsersToFile(users);

    res.status(200).send(users);
});

// Trang chủ
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
