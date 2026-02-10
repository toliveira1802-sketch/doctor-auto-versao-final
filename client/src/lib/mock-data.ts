// Mock data used by OrdensServico.tsx page
import type { OrderStatus } from "@/types/database";

export interface ServiceOrder {
  id: number;
  order_number: string;
  status: OrderStatus;
  vehicle_id: number;
  user_id: number;
  total: number;
  created_at: string;
}

export interface Vehicle {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
}

export interface User {
  id: number;
  full_name: string;
  phone: string;
}

export const mockServiceOrders: ServiceOrder[] = [
  { id: 1, order_number: "OS-001", status: "open", vehicle_id: 1, user_id: 1, total: 0, created_at: "2024-02-01T10:00:00Z" },
  { id: 2, order_number: "OS-002", status: "in_progress", vehicle_id: 2, user_id: 2, total: 1500, created_at: "2024-02-01T11:30:00Z" },
  { id: 3, order_number: "OS-003", status: "waiting_approval", vehicle_id: 3, user_id: 3, total: 3200, created_at: "2024-01-30T09:00:00Z" },
  { id: 4, order_number: "OS-004", status: "in_progress", vehicle_id: 4, user_id: 4, total: 2800, created_at: "2024-01-28T14:00:00Z" },
  { id: 5, order_number: "OS-005", status: "completed", vehicle_id: 5, user_id: 5, total: 650, created_at: "2024-01-25T08:00:00Z" },
];

const mockVehicles: Vehicle[] = [
  { id: 1, plate: "ABC-1234", brand: "Honda", model: "Civic", year: 2020 },
  { id: 2, plate: "DEF-5678", brand: "Hyundai", model: "HB20", year: 2021 },
  { id: 3, plate: "GHI-9012", brand: "VW", model: "Polo", year: 2022 },
  { id: 4, plate: "JKL-3456", brand: "Chevrolet", model: "Onix", year: 2019 },
  { id: 5, plate: "MNO-7890", brand: "Jeep", model: "Compass", year: 2023 },
];

const mockUsers: User[] = [
  { id: 1, full_name: "João Silva", phone: "(11) 99999-1234" },
  { id: 2, full_name: "Maria Santos", phone: "(11) 98888-5678" },
  { id: 3, full_name: "Pedro Lima", phone: "(11) 97777-9012" },
  { id: 4, full_name: "Ana Costa", phone: "(11) 96666-3456" },
  { id: 5, full_name: "Carlos Souza", phone: "(11) 95555-7890" },
];

export function getVehicleById(id: number): Vehicle | undefined {
  return mockVehicles.find((v) => v.id === id);
}

export function getUserById(id: number): User | undefined {
  return mockUsers.find((u) => u.id === id);
}
