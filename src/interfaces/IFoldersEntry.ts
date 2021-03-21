import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface IFoldersEntry {
  id: number;
  icon?: IconDefinition;
  folders: IFoldersSubEntry[];
  name: string;
  ref: string;
}

export interface IFoldersSubEntry {
  id: number;
  icon?: IconDefinition;
  name: string;
  ref: string;
}
