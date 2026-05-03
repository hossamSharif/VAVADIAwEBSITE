export interface Inquiry {
  id: string;
  fullName: string;
  companyName: string;
  whatsapp: string;
  email: string;
  country: string;
  productName: string;
  productCategory: string;
  quantity: string;
  targetPrice: string;
  preferredSource: 'India' | 'China' | 'UAE' | 'Any';
  requiredSupport: string[];
  notes: string;
  timestamp: number;
}

export interface Feedback {
  name: string;
  contact: string;
  message: string;
}
