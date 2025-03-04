
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Student } from '@/types/student';
import { useToast } from '@/components/ui/use-toast';

// Sample courses for consistent data
export const COURSES = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Business Administration",
  "Economics",
  "Psychology",
  "English Literature",
  "History"
];

// Sample data
const SAMPLE_STUDENTS: Student[] = [
  {
    id: "STU-123456789",
    name: "John Doe",
    email: "john.doe@example.com",
    course: "Computer Science",
    status: "active",
    enrollmentDate: "2023-09-01"
  },
  {
    id: "STU-234567890",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    course: "Mathematics",
    status: "active",
    enrollmentDate: "2023-08-15"
  },
  {
    id: "STU-345678901",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    course: "Physics",
    status: "inactive",
    enrollmentDate: "2023-07-20"
  },
  {
    id: "STU-456789012",
    name: "Emily Davis",
    email: "emily.d@example.com",
    course: "Biology",
    status: "active",
    enrollmentDate: "2023-09-10"
  },
  {
    id: "STU-567890123",
    name: "David Wilson",
    email: "david.w@example.com",
    course: "Business Administration",
    status: "active",
    enrollmentDate: "2023-08-05"
  }
];

interface StudentContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  searchStudents: (query: string) => Student[];
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: 'active' | 'inactive') => void;
  importSampleData: () => void;
  exportData: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'student-management-system-data';

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  });
  
  const { toast } = useToast();

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const addStudent = useCallback((studentData: Omit<Student, 'id'>) => {
    const newStudent = {
      ...studentData,
      id: `STU-${Math.random().toString(36).substr(2, 9)}`,
    };
    setStudents(prev => [...prev, newStudent]);
    toast({
      title: "Success",
      description: "Student added successfully",
    });
  }, [toast]);

  const updateStudent = useCallback((id: string, updatedData: Partial<Student>) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, ...updatedData } : student
      )
    );
    toast({
      title: "Success",
      description: "Student updated successfully",
    });
  }, [toast]);

  const deleteStudent = useCallback((id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    toast({
      title: "Success",
      description: "Student deleted successfully",
    });
  }, [toast]);

  const searchStudents = useCallback((query: string) => {
    return students.filter(student =>
      Object.values(student).some(value =>
        value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [students]);

  // New functionality
  const bulkDelete = useCallback((ids: string[]) => {
    setStudents(prev => prev.filter(student => !ids.includes(student.id)));
    toast({
      title: "Success",
      description: `${ids.length} students deleted successfully`,
    });
  }, [toast]);

  const bulkUpdateStatus = useCallback((ids: string[], status: 'active' | 'inactive') => {
    setStudents(prev =>
      prev.map(student =>
        ids.includes(student.id) ? { ...student, status } : student
      )
    );
    toast({
      title: "Success",
      description: `${ids.length} students updated successfully`,
    });
  }, [toast]);

  const importSampleData = useCallback(() => {
    setStudents(SAMPLE_STUDENTS);
    toast({
      title: "Success",
      description: "Sample data imported successfully",
    });
  }, [toast]);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(students, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `student-data-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Success",
      description: "Data exported successfully",
    });
  }, [students, toast]);

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        searchStudents,
        bulkDelete,
        bulkUpdateStatus,
        importSampleData,
        exportData,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}
