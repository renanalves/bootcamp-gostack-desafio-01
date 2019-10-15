const express = require("express");

const server = express();
server.use(express.json());

let requests = 0;
const projects = [];

function checkProjectExistsMiddleware(req, res, next) {
  const { id } = req.params;
  const project = projects.find(obj => obj.id == id);
  if (!project) {
    return res.status(400).json({error: 'Projeto não existe'});
  }
  return next();
}

function logRequests(req, res, next) {
  requests++;
  console.log(`Requests: ${requests}`);
  return next();
}

server.use(logRequests);

server.post("/projects", (req, res) => {
  const { id, title } = req.body; 
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExistsMiddleware, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(obj => obj.id == id);
  project.title = title;
  return res.json(project);
});

server.delete("/projects/:id", checkProjectExistsMiddleware, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(obj => obj.id == id);
  projects.splice(index, 1);
  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExistsMiddleware, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(obj => obj.id == id);
  project.tasks.push(title);
  return res.json(project);
});

server.listen(3000);

