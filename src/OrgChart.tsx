// OrgChart.tsx

import * as React from "react";
import EmployeeCard from "./EmployeeCard"; // Importing EmployeeCard component
import { Employee } from "./types"; // Importing Employee from types.ts
import "../style/visual.less";

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
  const [visibleSubordinates, setVisibleSubordinates] = React.useState<{ [key: string]: boolean }>({});

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

  // Processed employees and manager mapping
  const { processedEmployees, employeesByManager } = useProcessedEmployees(data);

  // Render employees
  const renderEmployees = (
    employees: Employee[],
    employeesByManager: Record<string, Employee[]>
  ) => (
    <div className="level">
      {employees.map(employee => (
        <div className="employee-cell" key={employee.name}>
          <EmployeeCard
            employee={employee}
            toggleSubordinates={() => {
              setVisibleSubordinates(prevState => ({
                ...prevState,
                [employee.name]: !prevState[employee.name],
              }));
            }}
          />
          {employeesByManager[employee.name] && (
            <div
              className="subordinates"
              style={{ display: visibleSubordinates[employee.name] ? "flex" : "none" }}
            >
              {renderEmployees(employeesByManager[employee.name], employeesByManager)}
            </div>
          )}
        </div>
      ))}
    </div>
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
        {renderEmployees(
          processedEmployees.filter(emp => !emp.manager),
          employeesByManager
        )}
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

// Custom hook to process employees
function useProcessedEmployees(data: Employee[]) {
  const [processedEmployees, setProcessedEmployees] = React.useState<Employee[]>([]);
  const [employeesByManager, setEmployeesByManager] = React.useState<Record<string, Employee[]>>({});

  React.useEffect(() => {
    // Deep copy to avoid mutating props
    const dataCopy = data.map(emp => ({ ...emp }));

    // Create a mapping of employees by manager
    const managerMap: Record<string, Employee[]> = {};

    dataCopy.forEach(employee => {
      if (employee.manager) {
        if (!managerMap[employee.manager]) {
          managerMap[employee.manager] = [];
        }
        managerMap[employee.manager].push(employee);
      }
    });

    // Find top-level managers
    const topManagers = dataCopy.filter(emp => !emp.manager);

    // Set levels recursively
    const setLevels = (employees: Employee[], currentLevel: number) => {
      employees.forEach(employee => {
        employee.level = currentLevel;
        if (managerMap[employee.name]) {
          setLevels(managerMap[employee.name], currentLevel + 1);
        }
      });
    };

    setLevels(topManagers, 0);

    setProcessedEmployees(dataCopy);
    setEmployeesByManager(managerMap);
  }, [data]);

  return { processedEmployees, employeesByManager };
}