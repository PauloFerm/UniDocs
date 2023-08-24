// const inquirer = require('@inquirer/prompts');
import { select } from "@inquirer/prompts";
import * as project from "./project";

const selectProjectMenu = async () => {
  let projects: project.url[] = require('./projectsIds.json'); 

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
  let currentProject = project.current();

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
      project.updateCurrent();
      break;
    case "deploy":
      project.deployToAll();
      break;
    case "change":
      let selectedProject = await selectProjectMenu();
      project.changeCurrent(selectedProject.id);
      console.log(`Current project: ${selectedProject.name}`);
      break;
    default:
      console.log("No action for", option);
  }
}

export const launchMenu = mainMenu();
