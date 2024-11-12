import * as React from "react";
import { Designation } from "./types";
interface DesignationCardProps {
    designation: Designation;
    toggleSubordinates: () => void;
}
declare const DesignationCard: React.FC<DesignationCardProps>;
export default DesignationCard;
