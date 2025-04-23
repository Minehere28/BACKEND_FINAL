// Tạo mới một phim.
// Lấy danh sách tất cả các phim, lấy 1 phim với ID
// Cập nhật thông tin của phim.
// Xóa phim.
// Đếm số lượng phim hiện có.
// Tìm kiếm phim theo thể loại.
// Tìm phim có xếp hạng cao nhất.
import express from 'express';
import mongoose from 'mongoose';

// MongoDB connection
mongoose.connect('mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number
});

// Create a model from the schema
const movieCollection = mongoose.model('Movie', movieSchema);

const app = express();
app.use(express.json());

//Tạo mới một phim
app.post('/movies', async (req, res) => {
  const { title, genre, rating } = req.body;
  try {
    const newMovie = await movieCollection({ title, genre, rating });
    const result = await newMovie.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

//Lấy danh sách tất cả các phim
app.get('/movies', async (req, res) => {
  try {
    const movies = await movieCollection.find();
    res.status(200).send(movies);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

//Lấy 1 phim với ID 
app.get('/movies/:id', async (req,res) => {
  try{
    const movie = await movieCollection.findById(req.params.id);
    if(!movie) return res.status(404).send('Movie not found!');
    res.send(movie);
  } catch(err){
    res.status(400).send('Error:' + err.message);
  }
});

//Cập nhật thông tin của phim
app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, genre, rating } = req.body;

  try {
    const result = await movieCollection.findByIdAndUpdate(
      id, 
      { title, genre, rating }, 
      { new: true }
    ); 

    if (!result) {
      res.status(404).send('Movie not found');
    } else {
      res.status(200).send('Movie updated');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Xóa 1 phim
app.delete('/movies/:id', async (req, res) => {
  try {
    const deleted = await movieCollection.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).send('Movie not found');
    res.send('Movie was deleted');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

//Đếm số lượng phim hiện có
app.get('/movies-count', async (req, res) => {
  try {
    const count = await movieCollection.countDocuments();
    res.send({count});
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

//Tìm kiếm phim theo thể loại (genre)
app.get('/movies/genre/:genre', async (req, res) => {
  try {
    const movie = await movieCollection.find({genre: req.params.genre});
    res.send(movie);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});
//Tìm kiếm phim có xếp hạng cao nhất
app.get('/movies/rating/top-rated', async (req, res) => {
  try {
    const topMovie = await movieCollection.findOne().sort({rating: -1});
    if (!topMovie)
      return res.status(404).send('No movies was found');
    res.send(topMovie);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
