import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronRight, Eye, Plus, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { Patient } from "../backend";
import { useActor } from "../hooks/useActor";
import { Link, useNavigate } from "../router";

function formatDate(ns: bigint) {
  return new Date(Number(ns / 1_000_000n)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Dashboard() {
  const { actor, isFetching } = useActor();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchPatients = useCallback(async () => {
    if (!actor) {
      if (!isFetching) setLoading(false);
      return;
    }
    if (isFetching) return;
    setLoading(true);
    setError(null);
    try {
      const data = await actor.getCallerPatients();
      setPatients(data);
    } catch {
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.mrdNumber.toLowerCase().includes(q) ||
      p.contactNumber.includes(q)
    );
  });

  const todayCount = patients.filter((p) => {
    const d = new Date(Number(p.createdAt / 1_000_000n));
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Patient Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your clinic patients
          </p>
        </div>
        <Link href="/patients/new">
          <Button
            data-ocid="dashboard.new_patient.primary_button"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Patient
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Patients"
          value={loading ? "\u2014" : patients.length.toString()}
          icon={<Users className="w-5 h-5" />}
          gradient="from-blue-500 to-blue-600"
          loading={loading}
        />
        <StatCard
          title="Registered Today"
          value={loading ? "\u2014" : todayCount.toString()}
          icon={<Calendar className="w-5 h-5" />}
          gradient="from-violet-500 to-violet-600"
          loading={loading}
        />
        <StatCard
          title="Active Records"
          value={loading ? "\u2014" : patients.length.toString()}
          icon={<Eye className="w-5 h-5" />}
          gradient="from-emerald-500 to-emerald-600"
          loading={loading}
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="dashboard.search_input"
          placeholder="Search by name, MRD number, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        {loading ? (
          <div data-ocid="dashboard.loading_state" className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div data-ocid="dashboard.error_state" className="p-12 text-center">
            <p className="text-destructive text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={fetchPatients}
            >
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div data-ocid="dashboard.empty_state" className="p-12 text-center">
            <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">
              {search ? "No patients match your search" : "No patients yet"}
            </p>
            {!search && (
              <Link href="/patients/new">
                <Button size="sm" className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Register first patient
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">
                  Patient
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">
                  MRD No.
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">
                  Phone
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">
                  Registered
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody data-ocid="dashboard.table">
              {filtered.map((patient, idx) => (
                <PatientRow
                  key={Number(patient.id)}
                  patient={patient}
                  index={idx + 1}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  gradient,
  loading,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl border border-border shadow-card p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function PatientRow({ patient, index }: { patient: Patient; index: number }) {
  const navigate = useNavigate();
  return (
    <tr
      data-ocid={`dashboard.patient.item.${index}`}
      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary">
              {getInitials(patient.name)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {patient.name}
            </p>
            <p className="text-xs text-muted-foreground sm:hidden">
              {patient.mrdNumber}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <Badge variant="outline" className="text-xs font-mono">
          {patient.mrdNumber}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
        {patient.contactNumber}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
        {formatDate(patient.createdAt)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            data-ocid={`dashboard.patient.view.button.${index}`}
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => navigate(`/patients/${Number(patient.id)}`)}
          >
            View
          </Button>
          <Button
            data-ocid={`dashboard.patient.exam.button.${index}`}
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() =>
              navigate(`/patients/${Number(patient.id)}/new-visit`)
            }
          >
            <Eye className="w-3 h-3" />
            Exam
          </Button>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </td>
    </tr>
  );
}
