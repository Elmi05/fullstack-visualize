import { FileText, Download, ChartBar, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { useStudents } from "@/context/StudentContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "@/components/ui/use-toast";
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

const Reports = () => {
  const { students } = useStudents();

  const generateReport = (type: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add header
    doc.setFontSize(20);
    doc.text("Student Management System", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(14);
    
    switch (type) {
      case "student-list":
        // Title
        doc.text("Student List Report", pageWidth / 2, 25, { align: "center" });
        doc.setFontSize(12);
        
        // Generate table
        const studentData = students.map(student => [
          student.id,
          student.name,
          student.email,
          student.course,
          student.status,
          new Date(student.enrollmentDate).toLocaleDateString()
        ]);

        autoTable(doc, {
          head: [['ID', 'Name', 'Email', 'Course', 'Status', 'Enrollment Date']],
          body: studentData,
          startY: 35,
        });
        break;

      case "enrollment-stats":
        // Title
        doc.text("Enrollment Statistics Report", pageWidth / 2, 25, { align: "center" });
        doc.setFontSize(12);

        // Course distribution
        const courseStats = students.reduce((acc: { [key: string]: number }, student) => {
          acc[student.course] = (acc[student.course] || 0) + 1;
          return acc;
        }, {});

        const courseData = Object.entries(courseStats).map(([course, count]) => [
          course,
          count.toString(),
          `${((count / students.length) * 100).toFixed(1)}%`
        ]);

        const tableOptions: UserOptions = {
          head: [['Course', 'Students', 'Percentage']],
          body: courseData,
          startY: 35,
        };

        const result = autoTable(doc, tableOptions);
        const finalY = result.lastAutoTable?.finalY || 35;

        // Status distribution
        doc.text("Status Distribution", 14, finalY + 20);
        autoTable(doc, {
          head: [['Status', 'Count', 'Percentage']],
          body: [
            ['Active', activeCount.toString(), `${((activeCount / students.length) * 100).toFixed(1)}%`],
            ['Inactive', inactiveCount.toString(), `${((inactiveCount / students.length) * 100).toFixed(1)}%`]
          ],
          startY: finalY + 25,
        });
        break;

      case "print":
        // Title
        doc.text("Detailed Student Report", pageWidth / 2, 25, { align: "center" });
        doc.setFontSize(12);

        let yPos = 35;
        students.forEach((student, index) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(`Student ${index + 1}: ${student.name}`, 14, yPos);
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          yPos += 7;
          doc.text(`ID: ${student.id}`, 20, yPos);
          yPos += 5;
          doc.text(`Email: ${student.email}`, 20, yPos);
          yPos += 5;
          doc.text(`Course: ${student.course}`, 20, yPos);
          yPos += 5;
          doc.text(`Status: ${student.status}`, 20, yPos);
          yPos += 5;
          doc.text(`Enrolled: ${new Date(student.enrollmentDate).toLocaleDateString()}`, 20, yPos);
          yPos += 15;
        });
        break;
    }

    // Save the PDF
    doc.save(`student-${type}-report.pdf`);
    
    toast({
      title: "Report Generated",
      description: `${type} report has been generated successfully.`,
    });
  };

  // Calculate course distribution data for the chart
  const courseData = students.reduce((acc: { [key: string]: number }, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(courseData).map(([course, count]) => ({
    course,
    students: count,
  }));

  const activeCount = students.filter(s => s.status === 'active').length;
  const inactiveCount = students.length - activeCount;

  const reports = [
    {
      title: "Student List",
      description: "Complete list of all enrolled students",
      icon: FileText,
      action: () => generateReport("student-list"),
    },
    {
      title: "Enrollment Statistics",
      description: "Statistical analysis of student enrollment",
      icon: ChartBar,
      action: () => generateReport("enrollment-stats"),
    },
    {
      title: "Print Report",
      description: "Print a detailed report of all students",
      icon: Printer,
      action: () => generateReport("print"),
    },
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Reports</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">Generate and download student reports</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {reports.map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <report.icon className="h-5 w-5" />
                  {report.title}
                </CardTitle>
                <CardDescription className="text-sm">{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={report.action}
                  className="w-full text-sm sm:text-base"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Course Distribution</CardTitle>
          <CardDescription className="text-sm">Student enrollment by course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] sm:h-[300px] lg:h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="students" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Quick Statistics</CardTitle>
            <CardDescription className="text-sm">Overview of current enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-xl sm:text-2xl font-bold">{students.length}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active Students</p>
                <p className="text-xl sm:text-2xl font-bold">{activeCount}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Inactive Students</p>
                <p className="text-xl sm:text-2xl font-bold">{inactiveCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;