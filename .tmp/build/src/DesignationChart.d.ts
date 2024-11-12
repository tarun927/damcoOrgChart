import React from "react";
import { Designation } from "./types";
import "../style/visual.less";
interface OrgChartProps {
    data: Designation[];
}
declare const OrgChart: React.FC<OrgChartProps>;
export default OrgChart;
