// DesignationCard.tsx

import * as React from "react";
import { Designation } from "./types";

interface DesignationCardProps {
  designation: Designation;
  toggleSubordinates: () => void;
}

const DesignationCard: React.FC<DesignationCardProps> = React.memo(
  ({ designation, toggleSubordinates }) => {

    return (
      <div
        className='designation-card'
      >
        {
          <div
          onClick={toggleSubordinates}
          className={'card-content node '+(designation.level === 0 ? 'management' : 
        (designation.level === 1 ? 'department' : 
        (designation.level >= 2 ? 'unit' : '')))}>
            <div className="node-title">{designation.designation}</div>
            <div className="node-subtitle">{designation.designation}</div>
          </div>
        }
      </div>
    );
  }
);

export default DesignationCard;
