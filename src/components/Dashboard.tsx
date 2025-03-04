
import { useState } from "react";
import { Search, Plus, FileText, Users, Settings as SettingsIcon, Trash2, Edit, Download, Upload, CheckSquare, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useStudents, COURSES } from "@/context/StudentContext";
import { StudentForm } from "./StudentForm";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import Reports from "./Reports";
import Settings from "./Settings";
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
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [studentToDelete, setStudentToDelete] = useState<Student | undefined>();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [courseFilter, setCourseFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | null>(null);
  
  const { 
    students, 
    deleteStudent, 
    searchStudents, 
    bulkDelete, 
    bulkUpdateStatus, 
    importSampleData, 
    exportData 
  } = useStudents();
  
  const { toast } = useToast();

  const menuItems = [
    { id: "students", icon: Users, label: "Students" },
    { id: "reports", icon: FileText, label: "Reports" },
    { id: "settings", icon: SettingsIcon, label: "Settings" },
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

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleBulkDelete = () => {
    if (selectedStudents.length > 0) {
      bulkDelete(selectedStudents);
      setSelectedStudents([]);
      setIsAllSelected(false);
    }
  };

  const handleBulkUpdateStatus = (status: 'active' | 'inactive') => {
    if (selectedStudents.length > 0) {
      bulkUpdateStatus(selectedStudents, status);
      setSelectedStudents([]);
      setIsAllSelected(false);
    }
  };

  // Apply filters to students
  let filteredStudents = searchQuery ? searchStudents(searchQuery) : students;
  
  // Apply course filter
  if (courseFilter) {
    filteredStudents = filteredStudents.filter(student => student.course === courseFilter);
  }
  
  // Apply status filter
  if (statusFilter) {
    filteredStudents = filteredStudents.filter(student => student.status === statusFilter);
  }

  // Reset filters
  const resetFilters = () => {
    setCourseFilter(null);
    setStatusFilter(null);
    setSearchQuery("");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return (
          <div className="glass-card rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Course</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {COURSES.map(course => (
                      <DropdownMenuItem 
                        key={course}
                        onClick={() => setCourseFilter(course)}
                        className={courseFilter === course ? "bg-primary/10" : ""}
                      >
                        {course}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setStatusFilter('active')}
                      className={statusFilter === 'active' ? "bg-primary/10" : ""}
                    >
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setStatusFilter('inactive')}
                      className={statusFilter === 'inactive' ? "bg-primary/10" : ""}
                    >
                      Inactive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {(courseFilter || statusFilter) && (
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                )}
                
                <Button
                  onClick={() => {
                    setSelectedStudent(undefined);
                    setIsFormOpen(true);
                  }}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Student
                </Button>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-500 mb-6">Add students or import sample data to get started</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                  <Button onClick={importSampleData} variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Sample Data
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {selectedStudents.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm">
                      {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkUpdateStatus('active')}
                      >
                        Mark Active
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkUpdateStatus('inactive')}
                      >
                        Mark Inactive
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleBulkDelete}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto mb-4 rounded-lg border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left">
                          <Checkbox 
                            checked={isAllSelected}
                            onCheckedChange={toggleSelectAll}
                          />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Course
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Enrolled
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Checkbox 
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() => toggleStudentSelection(student.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-xs text-gray-500 sm:hidden">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-gray-500">{student.course}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              student.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-sm text-gray-500">
                              {new Date(student.enrollmentDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(student)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={16} />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(student)}
                              className="text-red-600 hover:text-red-900 ml-2"
                            >
                              <Trash2 size={16} />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={exportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm" onClick={importSampleData}>
                    <Upload className="mr-2 h-4 w-4" />
                    Load Sample Data
                  </Button>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Student Management System</h1>
          <p className="text-gray-600">Manage your students and records efficiently</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          <nav className="w-full lg:w-64 mb-4 lg:mb-0">
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
            {renderContent()}
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
