import { useState } from "react";
import { Toaster } from "sonner";
import { RoleSelector } from "./components/Auth/RoleSelector";
import { LoginPage } from "./components/Auth/LoginForm";
import { SignUpPage } from "./components/Auth/SignUpForm";
import { StudentLoginForm } from "./components/Auth/StudentLoginForm";
import { StudentRegisterForm } from "./components/Auth/StudentRegisterForm";
import { StudentMainDashboard } from "./components/StudentPortal/StudentMainDashboard";
import { DashboardPage } from "./components/Views/DashboardPage";
import authService from "./services/authService";

export default function App() {
  const [page, setPage] = useState(() => {
    if (localStorage.getItem("student_token")) {
      return "student-dashboard";
    }
    if (authService.isAuthenticated()) {
      return "admin-dashboard";
    }
    return "portal";
  });

  const [studentUser, setStudentUser] = useState(() => {
    const raw = localStorage.getItem("campusiq_student");
    return raw ? JSON.parse(raw) : null;
  });

  const handleSelectRole = (role) => {
    if (role === "admin") {
      if (authService.isAuthenticated()) {
        setPage("admin-dashboard");
      } else {
        setPage("admin-login");
      }
    } else if (role === "student") {
      if (localStorage.getItem("student_token")) {
        setPage("student-dashboard");
      } else {
        setPage("student-login");
      }
    }
  };

  const handleAdminLogout = () => {
    authService.logout();
    setPage("portal");
  };

  const handleStudentLogout = () => {
    localStorage.removeItem("student_token");
    localStorage.removeItem("campusiq_student");
    setStudentUser(null);
    setPage("portal");
  };

  return (
    <>
      <Toaster richColors position="top-center" closeButton />

      {/* 1. Common Role Selection Landing Portal */}
      {page === "portal" && (
        <RoleSelector onSelectRole={handleSelectRole} />
      )}

      {/* 2. Student Authentication System: Login */}
      {page === "student-login" && (
        <div>
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setPage("portal")}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all shadow-sm"
            >
              ← Back to Portal
            </button>
          </div>
          <StudentLoginForm
            onNavigate={setPage}
            onLoginSuccess={(user) => {
              setStudentUser(user);
              setPage("student-dashboard");
            }}
          />
        </div>
      )}

      {/* 3. Student Authentication System: Register */}
      {page === "student-register" && (
        <div>
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setPage("portal")}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all shadow-sm"
            >
              ← Back to Portal
            </button>
          </div>
          <StudentRegisterForm
            onNavigate={setPage}
            onRegisterSuccess={(user) => {
              setStudentUser(user);
              setPage("student-dashboard");
            }}
          />
        </div>
      )}

      {/* 4. Student Dashboard (Full Featured matching Admin, Dedicated Auth, No Switch Button) */}
      {page === "student-dashboard" && (
        <StudentMainDashboard
          studentUser={studentUser}
          onLogout={handleStudentLogout}
        />
      )}

      {/* 5. Admin Authentication System: Login */}
      {page === "admin-login" && (
        <div>
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setPage("portal")}
              className="px-3.5 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
            >
              ← Back to Portal
            </button>
          </div>
          <LoginPage onNavigate={(target) => {
            if (target === "dashboard") setPage("admin-dashboard");
            else if (target === "signup") setPage("admin-signup");
            else setPage(target);
          }} />
        </div>
      )}

      {/* 6. Admin Authentication System: Sign Up */}
      {page === "admin-signup" && (
        <div>
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setPage("portal")}
              className="px-3.5 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
            >
              ← Back to Portal
            </button>
          </div>
          <SignUpPage onNavigate={(target) => {
            if (target === "dashboard") setPage("admin-dashboard");
            else if (target === "login") setPage("admin-login");
            else setPage(target);
          }} />
        </div>
      )}

      {/* 7. Admin Dashboard (Full Featured, Dedicated Auth, No Switch Button) */}
      {page === "admin-dashboard" && (
        <DashboardPage onLogout={handleAdminLogout} />
      )}
    </>
  );
}
