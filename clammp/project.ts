import { readFileSync, writeFileSync } from "fs";
import { exec } from "child_process";

export interface url { name: string, id: string };
export interface ClaspFile { scriptId: string, rootDir: string };

export const current = () => {
  const projects: url[] = require('./projectsIds.json');
  const clasp: ClaspFile = require('../.clasp.json');

  let current = projects.find(project => project.id == clasp.scriptId);

  if (current == undefined) { throw "Unregistered Project" }
  
  return current
}

const overwriteId = (path: string, id: string) => {
  let data = readFileSync(path, { encoding: 'utf-8' }); 
  let idRegex = /"scriptId":"[a-zA-Z0-9_-]*"/;
  let newData = data.replace(idRegex, `"scriptId":"${id}"`);
  
  writeFileSync(path, newData, 'utf-8');
}

export const changeCurrent = (id: string) => {
  // Executed in root directory
  overwriteId('./.clasp.json', id); 
  overwriteId('./gs/.clasp.json', id);
}

const runCommand = async (cmd: string) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

export const updateCurrent = () => {
  let command = "clasp push && cd gs && clasp pull && cd ..";
  runCommand(command);
}

// I think this is not working
export const deployToAll = async () => {
  const projects: url[] = require('./projectsIds.json');

  console.log("Proyectos:");
  for (let project of projects) {
    await changeCurrent(project.id);
    runCommand("clasp push");
  }
}
