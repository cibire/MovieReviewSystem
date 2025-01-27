const express = require('express');
const mongoose = require('mongoose');
const app = express();


app.listen(3000, () => console.log('Server running on http://localhost:3000'));


mongoose.connect('mongodb://127.0.0.1:27017/movieApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const movieSchema = new mongoose.Schema({
  title: String,
  year: String,
  type: String,
  poster: String,
  trailer: String
});

const commentSchema = new mongoose.Schema({
  movieTitle: String,
  user: String,
  text: String
});


const Movie = mongoose.model('Movie', movieSchema);
const Comment = mongoose.model('Comment', commentSchema);


app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(express.static('public'));


app.get('/movies', async (req, res) => {
  const posts = await Movie.find(); 
  res.render('movies', { posts });
});

app.get('/movies/:title', async (req, res) => {
  const movieTitle = req.params.title.replace(/_/g, ' ');  
  const movie = await Movie.findOne({ title: movieTitle });
  const movieComments = await Comment.find({ movieTitle: movieTitle });

  if (movie) {
    res.render('view', { movie, comments: movieComments });
  } else {
    res.status(404).send('Movie not found');
  }
});


app.post('/movies/:title/comments', async (req, res) => {
  const movieTitle = req.params.title.replace(/_/g, ' ');
  const { user, text } = req.body;

  const newComment = new Comment({ movieTitle, user, text });
  await newComment.save();

  res.redirect(`/movies/${encodeURIComponent(movieTitle)}`);
});


