export interface WorkspaceRequest {
  height: number;
  workType: 'developer' | 'designer' | 'creator' | 'general';
  deskType: 'fixed' | 'height_adjustable';
  spaceSize: 'compact' | 'medium' | 'executive';
  notes?: string;
}

export interface ErgonomicsInfo {
  deskHeight: number;
  chairHeight: number;
  eyeDistance: string;
  elbowAngle: string;
  tips: string[];
}

export interface HPProduct {
  id: string;
  category: 'laptop' | 'monitor' | 'printer' | 'accessory';
  name: string;
  specs: string[];
  price: number;
  originalPrice: number;
  discountRate?: number;
  tag?: string;
}

export interface WorkspaceResponse {
  score: number;
  ergonomics: ErgonomicsInfo;
  recommendedProducts: HPProduct[];
  aiSummary: string;
}
