// types.ts

export interface Employee {
    index: number;
    name: string;
    designation: string;
    imageBase64: string;
    managerIndex?: number;
    level?: number;
    grade: string;
    employeeNumber: number;
    experience: any;
    university: string;
    qualification: string;
  }

  export interface Designation {
    index: number;
    name: string;
    designation: string;
    imageBase64: string;
    managerIndex?: number;
    level?: number;
    grade: string;
    employeeNumber: number;
    experience: any;
    university: string;
    qualification: string;
  }