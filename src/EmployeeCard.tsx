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
            <img className="employee-photo" src={employee.imageBase64} />
            <div className="employee-designation">{employee.designation}</div>
            <div className="emp-info-container">
              <div className="item">
                <div className="">الاسم:</div>
                <div className="">{employee.name}</div>
              </div>
              <div className="item">
                <div className="">Grade:</div>
                <div className="">{employee.grade}</div>
              </div>
              <div className="item">
                <div className="">Employee Number:</div>
                <div className="">{employee.employeeNumber}</div>
              </div>
              <div className="item">
                <div className="employee-exp-label">Experience:</div>
                <div className="employee-exp">{employee.experience}</div>
              </div>
              <div className="item">
                 <div className="employee-college-label"> University/College:</div>
                 <div className="employee-college">{employee.university}</div>
              </div>
              <div className="item">
                <div className="employee-quali-label">Qualification:</div>
                <div className="employee-quali">{employee.qualification}</div>
              </div>
            </div>
            {/* <div className="employee-designation">
              {employee.designation || "No Designation"}
            </div> */}
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
