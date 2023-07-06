const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length - :response-time ms :body]")
);
app.use(cors());

let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 100);
};

app.get("/", (req, res) => {
  res.send("<h1>bing chillen</h1>");
});

app.get("/api/persons", (req, res) => {
  res.send(data);
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
