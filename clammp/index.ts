// const inquirer = require('@inquirer/prompts');
import { select } from "@inquirer/prompts";
import * as deploy from "./deploy";

import { Project } from "./deploy";

const selectProjectMenu = async () => {
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

const mainMenu = async () => {
    let currentProject = deploy.currentProject();

    const option = await select({
        message: `Current project: ${currentProject.name}`,
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
            let selectedProject = await selectProjectMenu();
            deploy.changeClaspProject(selectedProject.id);
            // Continue loging current project
        // case "current":
        //     let currentProject = deploy.currentProject();
        //     console.log("Current project:", currentProject.name)
        //     break;
        default:
            console.log("No action for", option);
    }
}

export const launchMenu = mainMenu();
