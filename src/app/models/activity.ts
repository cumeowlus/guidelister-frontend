export interface Activity {
  id: number;
  titre: string;
  description?: string;
  categorie?: string;
  adresse?: string;
  telephone?: string;
  horaires?: string;
  siteWeb?: string;
  ordreVisite?: number;
  nbJours?: number;
  guideId?: number;
}
