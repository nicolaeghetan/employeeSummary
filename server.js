const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

let notes = fs.readFileSync(path.join(__dirname, "db/db.json"));
let notesJSON = JSON.parse(notes);


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    return res.send(notesJSON);
});

app.get("/api/notes/:id", function (req, res) {
    

    for (let i = 0; i < notesJSON.length; i++) {

        if (req.params.id === notesJSON[i].id) {
            return res.json(notesJSON[i]);
        }
    }

    return res.json(false);
});

app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();
    notesJSON.push(newNote);


    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notesJSON),  (err) => {
        if (err) {
            throw err;
        }
        res.json(newNote);
    })
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    let newNotes = notesJSON.filter((note) => note.id != noteId);

    if (!newNotes) {
        res.status(500).send('Note is not found.');
    } else {
        notesJSON = newNotes;

        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notesJSON), function (err) {
            if (err) {
                throw err;
            }
            res.send(notesJSON);
        })
    }
});

app.listen(PORT, function () {
    console.log("App lostening on port " + PORT);
});