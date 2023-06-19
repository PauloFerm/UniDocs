
import { readFileSync, writeFileSync } from "fs";
import { exec } from "child_process";

interface Project { name: string, id: string };
interface ClaspFile { scriptId: string, rootDir: string };

export const logCurrentProject = () => {
    const projects: Project[] = require('./projectsIds.json');
    const clasp: ClaspFile = require('../.clasp.json');

    let current = projects.find(project => project.id == clasp.scriptId);

    if (current == undefined) { console.error("Non registered Project"); }
    else { console.log("Current project:", current.name); }
}

const overwriteId = (path: string, id: string) => {
    let data = readFileSync(path, { encoding: 'utf-8' }); 
    let newData = data.replace(/"scriptId":"[a-zA-Z0-9_-]*"/, `"scriptId":"${id}"`);
    
    writeFileSync(path, newData, 'utf-8');
}

export const  changeClaspProject = (id: string) => {
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

export const updateCurrentProject = () => {
    let command = "clasp push && cd gs && clasp pull && cd ..";
    runCommand(command);
}

export const deployToAllProjects = async () => {
    const projects: Project[] = require('./projectsIds.json');

    console.log("Proyectos:");
    for (let project of projects) {
        await changeClaspProject(project.id);
        runCommand("clasp push");
    }
}
