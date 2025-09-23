export interface ProductData {
  id: number;
  productCode: string;
  productName: string;
  category: string;
  description: string;
  unitPrice: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}
