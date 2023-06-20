// const inquirer = require('@inquirer/prompts');
import { select } from "@inquirer/prompts";
import * as deploy from "./deploy";

interface Project { name: string, id: string };

const selectProject = async () => {
    let projects: Project[] = require('./projectsIds.json'); 
        //.map(project => project.name);

    const selectedProject = await select({
        message: "Select a Project to deploy:",
        choices: projects.map(project => {
            return {
                name: project.name,
                value: project
            }
        })
    });

    return selectedProject
}

const launchMenu = async () => {

    const option = await select({
        message: "Select an option",
        choices: [
            {
                name: "Update current project",
                value: "update"
            },
            {
                name: "Deploy to all projects",
                value: "deploy"
            },
            {
                name: "View current project",
                value: "current"
            },
            {
                name: "Change current project",
                value: "change"
            }
        ]
    });

    switch (option) {
        case "update":
            deploy.updateCurrentProject();
            break;
        case "deploy":
            deploy.deployToAllProjects();
            break;
        case "change":
            let selectedProject = await selectProject();
            deploy.changeClaspProject(selectedProject.id);
            // Continue loging current project
        case "current":
            deploy.logCurrentProject();
            break;
        default:
            console.log("No action for", option);
    }
}

launchMenu();