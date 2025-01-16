import React, { createContext, useContext, useState, useCallback } from 'react';
import { Student } from '@/types/student';
import { useToast } from '@/components/ui/use-toast';

interface StudentContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  searchStudents: (query: string) => Student[];
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();

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

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        searchStudents,
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