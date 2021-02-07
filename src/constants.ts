import os from 'os';
import {join} from 'path'


export const HOME_DIR = os.homedir();
export const CWD = process.cwd();
export const CONFIG_DIR = join(HOME_DIR, ".config", "stack")  