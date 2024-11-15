import React, { useRef, useState } from "react";
import Tree from "react-d3-tree";
import EmployeeCard from "./EmployeeCard";
import { Employee } from "./types";
import "../style/visual.less";

interface OrgChartProps {
  data: Employee[];
}

interface TreeNode {
  index: number;
  managerIndex: number;
  name: any;
  position: string;
  imageBase64: any;
  grade: number;
  employeeNumber: number;
  experience: any;
  university: string;
  qualification: string;
  children?: TreeNode[];
  expanded?: boolean;
}

const OrgChart: React.FC<OrgChartProps> = ({ data }) => {
  console.log(data)
  // State hooks
  data[0].managerIndex = null;
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [translateX, setTranslateX] = React.useState(0);
  const [translateY, setTranslateY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [totalExpandLength, setTotalExpandLength] = React.useState(1);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [visibleSubordinates, setVisibleSubordinates] = React.useState<{ [key: number]: boolean }>({});
  

  const orgChartRef = React.useRef<HTMLDivElement>(null);

  const [treeTranslate, setTreeTranslate] = useState({ x: 650, y: 200 });

  const calculateActualTreeDimensions = () => {
    setZoomLevel(100)
    let x = setTimeout(() => {
      const employeeCards = document.querySelectorAll('.employee-card');
      
      if (employeeCards.length === 0) {
        console.log('No cards');
        return;
      }
  
      let leftmost = Infinity;
      let rightmost = -Infinity;
      let topmost = Infinity;
      let bottommost = -Infinity;
  
      employeeCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        
        leftmost = Math.min(leftmost, rect.left);
        rightmost = Math.max(rightmost, rect.right);
        
        topmost = Math.min(topmost, rect.top);
        bottommost = Math.max(bottommost, rect.bottom);
      });
  
      const actualWidth = rightmost - leftmost;
      const actualHeight = bottommost - topmost;
  
      const container = chartContainerRef.current;
      if (!container) return;
  
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
  
      // Calculate zoom
      const widthZoom = (containerWidth - 100) / actualWidth;  // 50px padding each side
      const heightZoom = (containerHeight - 100) / actualHeight;  // 50px padding top/bottom
 
      //smaller zoom - both dimensions fit
      let newZoom = Math.min(widthZoom, heightZoom);
      
      // Clamp zoom between reasonable values
      // newZoom = Math.min(Math.max(newZoom, 0.2), 1.0);
  
      const newTranslateX = (containerWidth - (actualWidth * newZoom)) / 2;
      const newTranslateY = 50;  
  
      setZoomLevel(newZoom);
      setTreeTranslate({ x: newTranslateX+450, y: newTranslateY });
  
      console.log('Tree Dimensions:', {
        actualWidth,
        actualHeight,
        leftmost,
        rightmost,
        topmost,
        bottommost,
        newZoom,
        newTranslateX,
        newTranslateY
      });
      clearTimeout(x);
    }, 100); 
  };
  
  // Updated fitToScreen function
  const fitToScreen = () => {
    calculateActualTreeDimensions();
  };
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


  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [zoom, setZoom] = useState(1);

  // Build Tree Data
  const buildTreeData = (data: Employee[], parent: number | null = null): TreeNode[] => {
    return data
      .filter(emp => emp.managerIndex === parent)
      .map(emp => ({
        name: emp.name || "Vacant Position",
        position: emp.designation || "No Designation",
        imageBase64: emp.imageBase64,
        index: emp.index,
        managerIndex : emp.managerIndex,
        grade: emp.grade,
        experience: emp.experience,
        employeeNumber: emp.employeeNumber,
        qualification: emp.qualification,
        university: emp.university,
        expanded: true,
        children: buildTreeData(data, emp.index),
      }));
  };

  const treeData = buildTreeData(data);

  // Toggle Node
  const toggleNodeExpansion = (nodeName: any) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.has(nodeName) ? newSet.delete(nodeName) : newSet.add(nodeName);
      return newSet;
    });
  };

  const expandAllNodes = () => {
    if(isExpanded){
      //collapse all
       setExpandedNodes(new Set());
       return;
    }
    //expand all
    const collectAllNodes = (nodes: TreeNode[]): Set<any> => {
      const nodeSet = new Set<any>();
      const traverse = (nodes: TreeNode[]) => {
        nodes.forEach(node => {
          nodeSet.add(node.index);
          if (node.children) traverse(node.children);
        });
      };
      traverse(nodes);
      return nodeSet;
    };

    const allNodeNames = collectAllNodes(treeData);
    setTotalExpandLength(allNodeNames.size)
    setExpandedNodes(allNodeNames);
  };

  const renderNode = ({ nodeDatum }: any) => (
    <foreignObject width="470" height="355" x="-225" y="-100">
      <EmployeeCard
        employee={{
          index: nodeDatum.index,
          managerIndex: nodeDatum.managerIndex,
          name: nodeDatum.name,
          designation: nodeDatum.position,
          grade: nodeDatum.grade,
          experience: nodeDatum.experience,
          employeeNumber: nodeDatum.employeeNumber,
          qualification: nodeDatum.qualification,
          university: nodeDatum.university,
          imageBase64: nodeDatum.imageBase64,
        }}
        toggleSubordinates={() => toggleNodeExpansion(nodeDatum.index)}
      />
    </foreignObject>
  );

  const processTreeData = (nodes: TreeNode[]): TreeNode[] =>
    nodes.map(node => ({
      ...node,
      children: node.children
        ? expandedNodes.has(node.index)
          ? processTreeData(node.children)
          : []
        : undefined,
    }));

    React.useEffect(()=>{
      //  expandAllNodes();
    },[])

    React.useEffect(()=>{

       if(expandedNodes.size === totalExpandLength){
        setIsExpanded(true);
       }else{
        setIsExpanded(false);
       }
    },[expandedNodes])

  return (
    <div style={{ position: "relative" }}>
          <div
        className="orgChart"
        ref={orgChartRef}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          width: "100%",
          height: "600px",
          overflow: "hidden"
        }}
      >
        <div
          ref={chartContainerRef}
          className="org-chart-container"
          style={{ 
            width: "100%", 
            height: "100%",
            position: "relative",
            visibility: zoomLevel<100 ? 'visible' : 'hidden'
          }}
        >
          <Tree
            data={processTreeData(treeData)}
            orientation="vertical"
            translate={treeTranslate}
            nodeSize={{ x: 650, y: 650 }} 
            renderCustomNodeElement={renderNode}
            separation={{ siblings: 1.1, nonSiblings: 1.5 }} 
            pathFunc="step"
            collapsible={false}
            zoom={zoomLevel}
            zoomable
          />
        </div>
      </div>

    <div className="zoom-control-container">
      <button
        className="zoom-control-btn"
        onClick={expandAllNodes}
        style={{ width: "80px" }}
      >
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      <button 
        className="zoom-control-btn" 
        style={{ width: "180px" }}
        onClick={fitToScreen}
      >
        Fit to Screen
      </button>
      {/* <button
        className="zoom-control-btn"
        onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 2))}
      >
        +
      </button>
      <button
        className="zoom-control-btn"
        onClick={() => setZoomLevel(prev => {
          console.log(prev);
          return Math.max(prev - 0.1, 0.4)
        })}
      >
        -
      </button> */}
    </div>
  </div>
  );
};

export default OrgChart;
