import { isHttpMethod } from "../httpHelpers";
import {} from 'util';
import {extractPathVariableNames} from "..";
import Log from "../log/log";

/**
 * Checks the module before being ran through the preloadFunctions
 */
export default function preCheck({ handle, path, method }: any) {
  // Handle checks
  if(!handle) {
    throw new Log({
      level: 'ERROR',
      message: 'Does not export handle',
    });
  }
  if(typeof handle !== 'function') {
    throw new Log({
      level: 'ERROR',
      message: 'The handle export is not a function'
    });
  }

  // Method checks
  if(!method) {
    throw new Log({
      level: 'ERROR',
      message: 'Does not export method'
    });
  }
  if(!isHttpMethod(method)) {
    throw new Log({
      level: 'ERROR',
      message: `Method "${method}" is not a valid HTTP method`
    });
  }


  // Path check
  if(!path) {
    throw new Log({
      level: 'ERROR',
      message: 'Does not export path'
    });
  }

  // If the paths is a single string wrap it in an array
  const paths = Array.isArray(path) ? path : [ path ];

  // Checks if the path array is not empty
  if(paths.length === 0) {
    throw new Log({ 
      level: 'ERROR',
      message: 'The path export cannot be an empty array'
    });
  }

  for(const path of paths) {
    // Check if path starts with '/'
    if(!path.startsWith('/')) {
      throw new Log({
        level: 'ERROR',
        message: `Path "${path}" must start with a "/"`
      });
    }

    // TODO: check if all characters are valid

    // check if path variables are only declared once
    const pathVariables = extractPathVariableNames(path);
    for(const [ index, variable ] of pathVariables.entries()) {
      if(pathVariables.indexOf(variable) !== index) {
        throw new Log({
          level: 'ERROR',
          message: `Path "${path}" main only define the variable "${variable}" once` 
        });
      }
    }
  }

  // Check if all paths delcare the same variables
  const variables = paths.map(extractPathVariableNames).map(variables => variables.sort());
  // There will always be at least one so this is fine
  let ref = variables[0];
  for(let pi = 1; pi < variables.length; pi++) {
    for(let i = 0; i < variables.map(x => x.length).reduce((max, x) => x > max ? x : max, 0); i++) {
      if(ref[i] !== variables[pi]?.[i]) {
        throw new Log({ 
          level: 'ERROR',
          message: `Paths "${path.join(', ')}" must all define the same variables`
        });
      }
    }
  }
}
