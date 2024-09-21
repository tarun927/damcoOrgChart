import * as React from "react";
import { Employee } from "./types";
import "../style/visual.less";
interface OrgChartProps {
    data: Employee[];
}
declare const OrgChart: React.FC<OrgChartProps>;
export default OrgChart;
