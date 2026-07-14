import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface SelectOption {
  value: string;
  label: string;
  badgeClass?: string;
  icon?: IconDefinition;
}
