import { useState } from "react";
import { Search, Plus, FileText, Users, Settings, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { useStudents } from "@/context/StudentContext";
import { StudentForm } from "./StudentForm";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentToDelete, setStudentToDelete] = useState<Student | undefined>();
  
  const { students, deleteStudent, searchStudents } = useStudents();

  const menuItems = [
    { id: "students", icon: Users, label: "Students" },
    { id: "reports", icon: FileText, label: "Reports" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(undefined);
    }
  };

  const filteredStudents = searchQuery ? searchStudents(searchQuery) : students;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Management System</h1>
          <p className="text-gray-600">Manage your students and records efficiently</p>
        </header>

        <div className="flex gap-8">
          <nav className="w-64">
            <div className="glass-card rounded-xl p-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <main className="flex-1">
            <div className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                  />
                </div>
                <Button
                  onClick={() => {
                    setSelectedStudent(undefined);
                    setIsFormOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Student
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student, i) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.id}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {student.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Course:</span> {student.course}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Enrolled:</span>{" "}
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(student)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(student)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      <StudentForm
        student={selectedStudent}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedStudent(undefined);
        }}
      />

      <AlertDialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student's record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;