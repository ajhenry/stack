// Default stack files

import { Stack } from "./parser";

export const npmStart = (project: string, useYarn: boolean): string => {
  const tool = useYarn ? "yarn" : "npm";
  return `
    name: Common npm start stack
    version: 0.1
    
    requires: 
      - ${tool}
      - git
    
    start:
      - ${tool} start
    
    install:
      - git clone https://github.com/${project}.git .
      - ${tool} ${tool === "npm" ? "i" : ""}
    `;
};
