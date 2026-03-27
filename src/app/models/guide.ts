import { Activity } from './activity';
import { User } from './user';

export interface Guide {
  id: number;
  titre: string;
  description?: string;
  nbJour?: number;
  mobilite?: string;
  saison?: string;
  publicCible?: string;
  activites?: Activity[];
  authorizedUsers?: User[];
}
