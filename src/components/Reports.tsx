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

const Reports = () => {
  const { students } = useStudents();

  const generateReport = (type: string) => {
    // In a real application, this would generate a proper PDF report
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
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
        <p className="text-gray-600 mt-2">Generate and download student reports</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <report.icon className="h-5 w-5" />
                  {report.title}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={report.action}
                  className="w-full"
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

      <Card>
        <CardHeader>
          <CardTitle>Course Distribution</CardTitle>
          <CardDescription>Student enrollment by course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
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
            <CardTitle>Quick Statistics</CardTitle>
            <CardDescription>Overview of current enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-2xl font-bold">
                  {students.filter((s) => s.status === "active").length}
                </p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-gray-600">Inactive Students</p>
                <p className="text-2xl font-bold">
                  {students.filter((s) => s.status === "inactive").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;