const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const password = "IvrHWcYLnWFDlkIH";
const url = `mongodb+srv://aryanwar:${password}@phonebook.yodzzw3.mongodb.net/?retryWrites=true&w=majority`;

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length - :response-time ms :body]")
);
app.use(cors());
app.use(express.static("build"));

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

const generateId = () => {
  return Math.floor(Math.random() * 100);
};

app.get("/", (req, res) => {
  res.send("<h1>bing chillen</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${data.length} people`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = data.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  data = data.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name/number missing",
    });
  }

  const existingPerson = data.find((p) => p.name === body.name);
  if (existingPerson) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }
  let id = generateId();
  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };

  data = data.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});
