// EmployeeCard.tsx

import * as React from "react";
import { Employee } from "./types";

interface EmployeeCardProps {
  employee: Employee;
  toggleSubordinates: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = React.memo(
  ({ employee, toggleSubordinates }) => {
    const isVacant = !employee.name || employee.name === "Vacant Position";

    return (
      <div
        className={`employee-card ${isVacant ? "vacant" : ""}`}
        onClick={toggleSubordinates}
      >
        {isVacant ? (
          <div className="vacant-card">
            <div className="vacant-text">Vacant Position</div>
            <div>{employee.designation || "No Designation"}</div>
          </div>
        ) : (
          <>
            <img src={employee.imageBase64} alt={employee.name} />
            <div>{employee.name}</div>
            <div>{employee.designation || "No Designation"}</div>
          </>
        )}
      </div>
    );
  }
);

export default EmployeeCard;