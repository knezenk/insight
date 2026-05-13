export interface Workspace {
  slug: string;
  name: string;
  vertical: 'institutional' | 'financial' | 'energy' | 'health' | 'retail' | 'industrial';
  theme: WorkspaceTheme;
  features: WorkspaceFeatures;
}

export interface WorkspaceTheme {
  primary: string;
  secondary: string;
  accent: string;
  logo: string;
  brandName: string;
}

export interface WorkspaceFeatures {
  tv: boolean;
  radio: boolean;
  print: boolean;
  online: boolean;
  social: boolean;
  competitive: boolean;
  influencers: boolean;
  pdfReports: boolean;
  newsletter: boolean;
  whatsappAlerts: boolean;
  ai: boolean;
}
