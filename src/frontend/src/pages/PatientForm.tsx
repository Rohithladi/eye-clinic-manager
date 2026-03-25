import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Patient } from "../backend";
import { useActor } from "../hooks/useActor";
import { useNavigate } from "../router";

interface PatientFormProps {
  patientId?: string;
}

export default function PatientForm({ patientId }: PatientFormProps) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const isEdit = !!patientId;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const now = Date.now();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    contactNumber: "",
    email: "",
    occupation: "",
    address: "",
    registrationNumber: `REG-${now}`,
    mrdNumber: `MRD-${now}`,
  });

  useEffect(() => {
    if (!isEdit || !actor || isFetching) return;
    const load = async () => {
      setLoading(true);
      try {
        const p: Patient = await actor.getPatient(BigInt(patientId));
        setForm({
          name: p.name,
          age: String(Number(p.age)),
          gender: p.gender,
          contactNumber: p.contactNumber,
          email: p.email ?? "",
          occupation: p.occupation ?? "",
          address: p.address ?? "",
          registrationNumber: p.registrationNumber,
          mrdNumber: p.mrdNumber,
        });
      } catch {
        toast.error("Failed to load patient data");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [actor, isFetching, isEdit, patientId, navigate]);

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSubmitting(true);
    try {
      const input = {
        name: form.name,
        age: BigInt(form.age || "0"),
        gender: form.gender,
        contactNumber: form.contactNumber,
        registrationNumber: form.registrationNumber,
        mrdNumber: form.mrdNumber,
        email: form.email || undefined,
        occupation: form.occupation || undefined,
        address: form.address || undefined,
      };
      if (isEdit) {
        await actor.updatePatient(BigInt(patientId), input);
        toast.success("Patient updated successfully");
        navigate(`/patients/${patientId}`);
      } else {
        const newId = await actor.createPatient(input);
        toast.success("Patient registered successfully");
        navigate(`/patients/${Number(newId)}`);
      }
    } catch {
      toast.error(
        isEdit ? "Failed to update patient" : "Failed to register patient",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          data-ocid="patient_form.back.button"
          variant="ghost"
          size="icon"
          onClick={() => navigate(isEdit ? `/patients/${patientId}` : "/")}
          className="h-9 w-9"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? "Edit Patient" : "Register Patient"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? "Update patient information"
              : "Add a new patient to your clinic"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              data-ocid="patient_form.name.input"
              id="name"
              placeholder="e.g. Sarah Johnson"
              value={form.name}
              onChange={set("name")}
              required
            />
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="age">
                Age <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="patient_form.age.input"
                id="age"
                type="number"
                placeholder="e.g. 35"
                value={form.age}
                onChange={set("age")}
                min="0"
                max="150"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.gender}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, gender: v }))
                }
              >
                <SelectTrigger data-ocid="patient_form.gender.select">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="contactNumber">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              data-ocid="patient_form.contact.input"
              id="contactNumber"
              placeholder="e.g. +1 555-234-5678"
              value={form.contactNumber}
              onChange={set("contactNumber")}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              data-ocid="patient_form.email.input"
              id="email"
              type="email"
              placeholder="e.g. patient@example.com"
              value={form.email}
              onChange={set("email")}
            />
          </div>

          {/* Occupation */}
          <div className="space-y-1.5">
            <Label htmlFor="occupation">
              Occupation{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              data-ocid="patient_form.occupation.input"
              id="occupation"
              placeholder="e.g. Teacher"
              value={form.occupation}
              onChange={set("occupation")}
            />
          </div>

          {/* Reg + MRD */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="regNumber">Registration No.</Label>
              <Input
                id="regNumber"
                value={form.registrationNumber}
                disabled
                className="bg-muted/40 font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mrdNumber">MRD Number</Label>
              <Input
                data-ocid="patient_form.mrd.input"
                id="mrdNumber"
                value={form.mrdNumber}
                onChange={isEdit ? set("mrdNumber") : undefined}
                disabled={!isEdit}
                className={
                  !isEdit
                    ? "bg-muted/40 font-mono text-xs"
                    : "font-mono text-xs"
                }
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address">
              Address{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              data-ocid="patient_form.address.textarea"
              id="address"
              placeholder="Street, City, State, ZIP"
              value={form.address}
              onChange={set("address")}
              rows={2}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            data-ocid="patient_form.cancel.button"
            type="button"
            variant="outline"
            onClick={() => navigate(isEdit ? `/patients/${patientId}` : "/")}
          >
            Cancel
          </Button>
          <Button
            data-ocid="patient_form.submit.primary_button"
            type="submit"
            disabled={submitting || !actor}
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? "Update Patient" : "Register Patient"}
          </Button>
        </div>
      </form>
    </div>
  );
}
