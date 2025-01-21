const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("body", function (requset, response) {
  return requset.method === "POST" ? JSON.stringify(requset.body) : "";
});

app.use(morgan(":method :url :res[content-length] - :response-time ms :body"));

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people <br/> ${new Date()} </p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).send("<p>The person you look for is not in phonebook");
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const randomId = Math.floor(Math.random() * 100000).toString();

  return persons.some((person) => person.id === randomId)
    ? generateId()
    : randomId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const uniqueName = persons.some((person) => person.name === body.name);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing",
    });
  }

  if (uniqueName) {
    return response.status(400).json({
      error: "The name already exist in phonebook",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
