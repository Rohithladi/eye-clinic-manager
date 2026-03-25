import { Toaster } from "@/components/ui/sonner";
import Layout from "./components/Layout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import PatientDetails from "./pages/PatientDetails";
import PatientForm from "./pages/PatientForm";
import UserManual from "./pages/UserManual";
import VisitForm from "./pages/VisitForm";
import { Route, RouterProvider } from "./router";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  return <Layout>{children}</Layout>;
}

function RouteContent() {
  return (
    <>
      <Route path="/user-manual">
        <UserManual />
      </Route>
      <Route path="/">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/patients/new">
        <ProtectedRoute>
          <PatientForm />
        </ProtectedRoute>
      </Route>
      <Route path="/patients/:id/edit">
        {(params) => (
          <ProtectedRoute>
            <PatientForm patientId={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/patients/:id/new-visit">
        {(params) => (
          <ProtectedRoute>
            <VisitForm patientId={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/patients/:id">
        {(params) => (
          <ProtectedRoute>
            <PatientDetails patientId={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/visits/:id">
        {(params) => (
          <ProtectedRoute>
            <VisitForm visitId={params.id} />
          </ProtectedRoute>
        )}
      </Route>
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <RouteContent />
      <Toaster />
    </RouterProvider>
  );
}
