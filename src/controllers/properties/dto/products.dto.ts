export class ProductsDTO {
  name: string;
  category: string;
  measurement_unit: string;
}

export class ProductsQueryDTO {
  category?: string;
  name?: string;
  measurement_unit?: string;
  order?: 'ASC' | 'DESC';
  order_by?: 'name' | 'category' | 'measurement_unit';
}
