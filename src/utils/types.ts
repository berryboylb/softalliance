import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
export interface Link {
  path: string;
  title: string;
  icon: IconDefinition;
  subLinks?: Link[];
}


export interface MyError {
  message: string;
}