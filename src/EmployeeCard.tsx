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
        {!isVacant ? (
          <div className="card-content">
            <img
              className="employee-photo"
              src={employee.imageBase64}
              alt={employee.name}
            />
            <div className="employee-name-label">الاسم:</div>
            <div className="employee-name">{employee.designation}</div>
            <div className="employee-designation">
              {employee.designation || "No Designation"}
            </div>
          </div>
        ) : (
          <div className="vacant-card">
            <div className="vacant-text">منصب شاغر</div>
            <div className="vacant-designation">
              {employee.designation || "No Designation"}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default EmployeeCard;