import { useState } from "react";
import { Search, Plus, FileText, Users, Settings } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("students");

  const menuItems = [
    { id: "students", icon: Users, label: "Students" },
    { id: "reports", icon: FileText, label: "Reports" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

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
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                  />
                </div>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  <Plus size={20} />
                  Add Student
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-lg p-6 shadow-sm hover-lift"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Student {i}</h3>
                        <p className="text-sm text-gray-500">ID: STU-{1000 + i}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> student{i}@example.com
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Course:</span> Computer Science
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;