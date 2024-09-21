import * as React from "react";
import { Employee } from "./types";
interface EmployeeCardProps {
    employee: Employee;
    toggleSubordinates: () => void;
}
declare const EmployeeCard: React.FC<EmployeeCardProps>;
export default EmployeeCard;
