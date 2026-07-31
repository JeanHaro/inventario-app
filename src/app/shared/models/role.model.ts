import { SelectOption } from "../components/select/models/select.model";

export type UserRole = 'admin' | 'analytics' | 'product-editor';

export const ROLE_OPTIONS: SelectOption[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'product-editor', label: 'Editor de productos' }
]
