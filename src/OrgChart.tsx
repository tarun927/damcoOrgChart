// OrgChart.tsx

import * as React from "react";
import EmployeeCard from "./EmployeeCard"; // Importing EmployeeCard component
import { Employee } from "./types"; // Importing Employee from types.ts
import "../style/visual.less";

interface EmployeeNode extends Employee {
  subordinates?: EmployeeNode[];
}

interface OrgChartProps {
  data: Employee[];
}

const OrgChart: React.FC<OrgChartProps> = ({ data }) => {
  // State hooks
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [translateX, setTranslateX] = React.useState(0);
  const [translateY, setTranslateY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [visibleSubordinates, setVisibleSubordinates] = React.useState<{ [key: number]: boolean }>({});

  const orgChartRef = React.useRef<HTMLDivElement>(null);

  // Event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX - translateX);
    setStartY(e.clientY - translateY);
  };

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setTranslateX(e.clientX - startX);
      setTranslateY(e.clientY - startY);
    },
    [isDragging, startX, startY]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    setZoomLevel(prevZoom =>
      e.deltaY < 0 ? Math.min(prevZoom + 0.1, 2) : Math.max(prevZoom - 0.1, 0.5)
    );
  };

  // Attach event listeners
  React.useEffect(() => {
    const orgChartElement = orgChartRef.current;
    if (!orgChartElement) return;

    orgChartElement.addEventListener("mousedown", handleMouseDown as any);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    orgChartElement.addEventListener("wheel", handleWheel);

    return () => {
      orgChartElement.removeEventListener("mousedown", handleMouseDown as any);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      orgChartElement.removeEventListener("wheel", handleWheel);
    };
  }, [handleMouseMove, isDragging, startX, startY]);

  // Build the employee tree
  const employeeTree = React.useMemo(() => buildEmployeeTree(data), [data]);

  const toggleSubordinates = React.useCallback(
    (employeeIndex: number) => {
      setVisibleSubordinates(prevState => {
        const currentValue = prevState[employeeIndex] !== undefined ? prevState[employeeIndex] : true;
        const newValue = !currentValue;
        const newState = {
          ...prevState,
          [employeeIndex]: newValue,
        };
        console.log("Updated visibleSubordinates:", newState);
        return newState;
      });
    },
    []
  );

  // Render the employee tree
  const renderEmployeeNode = React.useCallback(
    (employee: EmployeeNode): JSX.Element => {
      const hasSubordinates =
        employee.subordinates && employee.subordinates.length > 0;
      const isVisible = visibleSubordinates[employee.index] !== false; // Default to true to show subordinates initially
 
      return (
        <div className="employee-cell" key={employee.index}>
          {!!employee.managerIndex && <div className="arrow-container">
            <div className="arrow-line"></div>
            <div className="arrow-head"></div>
          </div>}
 
          <EmployeeCard
            employee={employee}
            toggleSubordinates={() => toggleSubordinates(employee.index)}
          />
 
          {/* Render linking lines */}
          {hasSubordinates && (
            <div className="link-line-container">
              {isVisible && (
                <>
                  <div className="link-line-vertical"></div>
                  <div className="link-line-horizontal horiz-above"></div>
                  <div className="link-line-horizontal"></div>
                </>
              )}
            </div>
          )}
 
          {hasSubordinates && (
            <div
              className="subordinates"
              style={{ display: isVisible ? "flex" : "none" }}
            >
              {employee.subordinates!.map(subordinate =>
                renderEmployeeNode(subordinate)
              )}
            </div>
          )}
        </div>
      );
    },
    [visibleSubordinates, toggleSubordinates]
  );

  return (
    <div style={{ position: "relative" }}>
      <div
        className="orgChart"
        ref={orgChartRef}
        style={{
          transform: `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`,
          transformOrigin: "0 0",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <div className="org-chart-container">
          {employeeTree.map(employee => renderEmployeeNode(employee))}
        </div>
      </div>
      <div className="zoom-control-container">
        <button
          className="zoom-control-btn"
          onClick={() => setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 2))}
        >
          +
        </button>
        <button
          className="zoom-control-btn"
          onClick={() => setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.5))}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default OrgChart;

// Helper function to build the employee tree
function buildEmployeeTree(employees: Employee[]): EmployeeNode[] {
  const employeesMap = new Map<number, EmployeeNode>();

  // Initialize the map
  employees.forEach(emp => {
    employeesMap.set(emp.index, { ...emp, subordinates: [] });
  });

  const rootEmployees: EmployeeNode[] = [];

  employees.forEach(emp => {
    const employeeNode = employeesMap.get(emp.index)!;
    if (emp.managerIndex !== undefined && emp.managerIndex !== null) {
      const managerNode = employeesMap.get(emp.managerIndex);
      if (managerNode) {
        managerNode.subordinates!.push(employeeNode);
      } else {
        // Manager not found, treat as root
        console.warn(`Manager with index ${emp.managerIndex} not found for employee${emp.index}`);
        rootEmployees.push(employeeNode);
      }
    } else {
      // No manager, treat as root
      rootEmployees.push(employeeNode);
    }
  });
  return rootEmployees;
}