// src/server.ts
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import dotenv from "dotenv";
var request = require("request");
const path = require("path");

// Laden Sie die Umgebungsvariablen aus der .env-Datei
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

interface Project {
  id: string;
  name: string;
  client: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  task: string;
  minutes: number;
  datum: Date;
}

const dataFile = "./data.json";

const loadData = (): {
  projects: Project[];
  employees: Employee[];
  timeEntries: TimeEntry[];
} => {
  try {
    const dataBuffer = fs.readFileSync(dataFile);
    const dataJson = dataBuffer.toString();
    return JSON.parse(dataJson);
  } catch (error) {
    return {
      projects: [],
      employees: [],
      timeEntries: [],
    };
  }
};

const saveData = (data: {
  projects: Project[];
  employees: Employee[];
  timeEntries: TimeEntry[];
}): void => {
  const dataJson = JSON.stringify(data);
  fs.writeFileSync(dataFile, dataJson);
};
/* 
request.post(
  "http://localhost:3000/projects",
  {
    json: {
      name: "Beispielprojekt4",
      client: "Beispielkunde5",
    },
  },
  function (error: Error, response: Response, body: any) {
    console.log(error);
  }
);

request.post(
  "http://localhost:3000/employees",
  {
    json: {
      firstName: "Max",
      lastName: "Mustermann",
      email: "max.mustermann@example.com",
    },
  },
  function (error: Error, response: Response, body: any) {
    console.log(error);
  }
); 
request.post(
  "http://localhost:3000/timeEntries",
  {
    json: {
      employeeId: "EMPLOYEE_ID",
      projectId: "PROJECT_ID",
      task: "Beispielaufgabe",
      minutes: 120,
      datum: new Date("August 19, 1975 23:15:30"),
    },
  },
  function (error: Error, response: Response, body: any) {
    console.log(error);
  }
);
*/

app.post("/projects", (req: Request, res: Response) => {
  const { name, client } = req.body;
  const newProject: Project = { id: uuidv4(), name, client };
  const data = loadData();
  if (!checkExistingProject(data.projects, newProject)) {
    data.projects.push(newProject);
    saveData(data);
    res.status(201).json(newProject);
  } else res.status(304).json("no new project added");
});

app.get("/projects", (req: Request, res: Response) => {
  const data = loadData();
  res.send({ projects: data.projects });
});

function checkExistingProject(projects: Project[], newProject: Project) {
  return projects.find(
    (project) =>
      project.name === newProject.name && project.client === newProject.client
  );
}

app.post("/employees", (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  const newEmployee: Employee = { id: uuidv4(), firstName, lastName, email };
  const data = loadData();
  data.employees.push(newEmployee);
  saveData(data);
  res.status(201).json(newEmployee);
});

app.get("/employees", (req: Request, res: Response) => {
  const data = loadData();
  res.status(200).json(data.employees);
});

app.post("/timeEntries", (req: Request, res: Response) => {
  const { employeeId, projectId, task, minutes, datum } = req.body;
  const newTimeEntry: TimeEntry = {
    id: uuidv4(),
    employeeId,
    projectId,
    task,
    minutes,
    datum,
  };
  const data = loadData();
  if (minutes <= 480) {
    data.timeEntries.push(newTimeEntry);
    saveData(data);
    res.status(201).json(newTimeEntry);
  } else res.status(304).json({ message: "no time entry added" });
});

app.get("/timeentries", (req: Request, res: Response) => {
  const data = loadData();
  console.log(data.timeEntries);
  var datum: string;
  if (req.query && req.query.datum) {
    datum = (req.query as any).datum;
    res.send({
      timeEntry: data.timeEntries.filter(
        (entry) => entry.datum?.toString() === datum
      ),
    });
  } else res.send({ AllTimeEntries: data.timeEntries });
});

app.get("/", (req, res) => {
  res.send({ title: "GeeksforGeeks" });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../react-app/build", "index.html"));
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port 4000`);
});
