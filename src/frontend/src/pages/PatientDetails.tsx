import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Eye,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Patient, Visit } from "../backend";
import { useActor } from "../hooks/useActor";
import { useNavigate } from "../router";

interface PatientDetailsProps {
  patientId: string;
}

function formatDate(ns: bigint) {
  return new Date(Number(ns / 1_000_000n)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PatientDetails({ patientId }: PatientDetailsProps) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!actor || isFetching) return;
    setLoading(true);
    setError(null);
    try {
      const [p, v] = await Promise.all([
        actor.getPatient(BigInt(patientId)),
        actor.getVisitsByPatient(BigInt(patientId)),
      ]);
      setPatient(p);
      setVisits(v);
    } catch {
      setError("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching, patientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!actor || !patient) return;
    try {
      await actor.deletePatient(patient.id);
      toast.success("Patient deleted successfully");
      navigate("/");
    } catch {
      toast.error("Failed to delete patient");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div
        data-ocid="patient_details.error_state"
        className="text-center py-20"
      >
        <p className="text-destructive text-sm">
          {error ?? "Patient not found"}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            data-ocid="patient_details.back.button"
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-9 w-9 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {patient.name}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs">
                {patient.mrdNumber}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {String(Number(patient.age))} yrs
              </span>
              <span className="text-sm text-muted-foreground">&bull;</span>
              <span className="text-sm text-muted-foreground">
                {patient.gender}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            data-ocid="patient_details.edit.button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/patients/${patientId}/edit`)}
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button
            data-ocid="patient_details.new_exam.primary_button"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/patients/${patientId}/new-visit`)}
          >
            <Eye className="w-3.5 h-3.5" />
            Start New Exam
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                data-ocid="patient_details.delete.open_modal_button"
                variant="outline"
                size="icon"
                className="h-9 w-9 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-ocid="patient_details.delete.dialog">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>{patient.name}</strong>? This will permanently remove
                  all their records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="patient_details.delete.cancel_button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="patient_details.delete.confirm_button"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact info */}
        <div className="md:col-span-1">
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              <InfoRow
                icon={<Phone className="w-4 h-4" />}
                label="Phone"
                value={patient.contactNumber}
              />
              {patient.occupation && (
                <InfoRow
                  icon={<Briefcase className="w-4 h-4" />}
                  label="Occupation"
                  value={patient.occupation}
                />
              )}
              {patient.address && (
                <InfoRow
                  icon={<MapPin className="w-4 h-4" />}
                  label="Address"
                  value={patient.address}
                />
              )}
              {patient.email && (
                <InfoRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={patient.email}
                />
              )}
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Registered {formatDate(patient.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical history */}
        <div className="md:col-span-2">
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">
                Clinical History
              </h2>
              <Badge variant="secondary" className="text-xs">
                {visits.length} visit{visits.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {visits.length === 0 ? (
              <div
                data-ocid="patient_details.visits.empty_state"
                className="border-2 border-dashed border-border rounded-lg p-10 text-center"
              >
                <Calendar className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  No visits recorded
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start a new exam to create the first visit record
                </p>
                <Button
                  size="sm"
                  className="mt-4 gap-2"
                  onClick={() => navigate(`/patients/${patientId}/new-visit`)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Start First Exam
                </Button>
              </div>
            ) : (
              <div
                data-ocid="patient_details.visits.list"
                className="space-y-3"
              >
                {visits.map((visit, idx) => (
                  <VisitCard
                    key={Number(visit.id)}
                    visit={visit}
                    index={idx + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function VisitCard({ visit, index }: { visit: Visit; index: number }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      data-ocid={`patient_details.visits.item.${index}`}
      className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent hover:border-primary/20 transition-all cursor-pointer text-left"
      onClick={() => navigate(`/visits/${Number(visit.id)}`)}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {new Date(Number(visit.date / 1_000_000n)).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {visit.diagnosis.diagnosis || "No diagnosis recorded"}
          </p>
        </div>
      </div>
      <Badge className="text-xs bg-emerald-500/10 text-emerald-700 border-emerald-200">
        Completed
      </Badge>
    </button>
  );
}
