// EmployeeCard.tsx
import * as React from "react";
import { Employee } from "./types";


interface EmployeeCardProps {
  employee: Employee;
  toggleSubordinates: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, toggleSubordinates }) => (
  <div className={`employee-card level-${employee.level}`} onClick={toggleSubordinates}>
    <img src={employee.imageBase64} alt={employee.name} />
    <div>{employee.name}</div>
    <div>{employee.designation}</div>
  </div>
);

export default EmployeeCard;