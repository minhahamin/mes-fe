export interface EmployeeData {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
}
