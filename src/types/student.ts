export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  status: 'active' | 'inactive';
  enrollmentDate: string;
}