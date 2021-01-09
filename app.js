const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Note = require('./models/notes')

mongoose.connect('mongodb://localhost:27017/noteapp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connection To MONGO SUCCEEDED!');
    })
    .catch(e => {
        console.log('Connection To MONGO FAILED!!!!!');
        console.log(e);
    })



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const notes = await Note.find({});
    res.render('index', { notes });
})

app.post('/', async (req, res) => {
    const newNote = new Note(req.body);
    await newNote.save();
    res.redirect('/');
})

app.get('/note/:id', async (req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id);
    res.render('show', { note });
})

app.get('/new', (req, res) => {
    res.render('new')
})

app.get('/note/:id/edit', async (req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id);
    res.render('edit', { note })
})

app.patch('/note/:id', async (req, res) => {
    const { id } = req.params;
    const note = await Note.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.redirect(`/note/${ note._id }`)
})

app.delete('/note/:id', async (req, res) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.redirect('/');
})

app.listen(3000, () => {
    console.log("Running on PORT 3000!");
})