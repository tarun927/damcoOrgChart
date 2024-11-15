// types.ts

export interface Employee {
    index: number;
    name: string;
    designation: string;
    imageBase64: any;
    managerIndex?: number;
    level?: number;
    grade: number;
    employeeNumber: number;
    experience: any;
    university: string;
    qualification: string;
  }

  export interface Designation {
    index: number;
    name: string;
    designation: string;
    imageBase64: any;
    managerIndex?: number;
    level?: number;
    grade: number;
    employeeNumber: number;
    experience: any;
    university: string;
    qualification: string;
  }