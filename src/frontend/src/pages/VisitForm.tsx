import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Visit, VisitInput } from "../backend";
import { useActor } from "../hooks/useActor";
import { useNavigate } from "../router";

interface VisitFormProps {
  patientId?: string;
  visitId?: string;
}

const emptyVisitInput = (): VisitInput => ({
  date: BigInt(Date.now()) * 1_000_000n,
  caseHistory: {
    chiefComplaint: "",
    glassesHistory: "",
    pgp: "",
    consultationHistory: "",
    familyHistory: "",
    traumaHistory: "",
    systemicDiseaseHistory: "",
    medicationHistory: "",
    surgeryHistory: "",
    allergyHistory: "",
    socialHistory: "",
  },
  visualAcuity: {
    distanceOD: "",
    distanceOS: "",
    nearOD: "",
    nearOS: "",
    unaidedOD: "",
    unaidedOS: "",
    pinholeOD: "",
    pinholeOS: "",
    previousGlasses: "",
    objectiveRefraction: "",
    subjectiveRefraction: "",
    newCorrectionOD: "",
    newCorrectionOS: "",
    newCorrectionODVa: "",
    newCorrectionOSVa: "",
  },
  clinicalExam: {
    colorVisionOD: "",
    colorVisionOS: "",
    keratometryVertical: "",
    keratometryHorizontal: "",
    keratometryComments: "",
    coverTest: "",
    npcSubjective: "",
    npcObjective: "",
    eom: "",
    npaOD: "",
    npaOS: "",
    npaOU: "",
    wfdt: "",
    stereopsis: "",
  },
  anteriorSegment: {
    pupillaryEvaluation: "",
    externalExam: "",
    palpebralFissureHeight: "",
    ocularAdnexaOD: "",
    ocularAdnexaOS: "",
    corneaOD: "",
    corneaOS: "",
    conjunctivaOD: "",
    conjunctivaOS: "",
    scleraOD: "",
    scleraOS: "",
    anteriorChamberOD: "",
    anteriorChamberOS: "",
    irisOD: "",
    irisOS: "",
    pupilOD: "",
    pupilOS: "",
    lensOD: "",
    lensOS: "",
  },
  specialTests: {
    tonometryMethod: "",
    tonometryTime: "",
    tonometryOD: "",
    tonometryOS: "",
    gonioscopy: "",
    tbutOD: "",
    tbutOS: "",
    schirmerOD: "",
    schirmerOS: "",
    syringingOD: "",
    syringingOS: "",
    roplasOD: "",
    roplasOS: "",
    otherProcedures: "",
    dilationInstructions: "",
  },
  diagnosis: {
    diagnosis: "",
    intervention: "",
    learningNotes: "",
  },
});

export default function VisitForm({ patientId, visitId }: VisitFormProps) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const isEdit = !!visitId;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [visitData, setVisitData] = useState<VisitInput>(emptyVisitInput());
  const [resolvedPatientId, setResolvedPatientId] = useState<bigint | null>(
    patientId ? BigInt(patientId) : null,
  );

  const fetchVisit = useCallback(async () => {
    if (!isEdit || !actor || isFetching) return;
    setLoading(true);
    try {
      const v: Visit = await actor.getVisit(BigInt(visitId));
      setResolvedPatientId(v.patientId);
      setVisitData({
        date: v.date,
        caseHistory: v.caseHistory,
        visualAcuity: v.visualAcuity,
        clinicalExam: v.clinicalExam,
        anteriorSegment: v.anteriorSegment,
        specialTests: v.specialTests,
        diagnosis: v.diagnosis,
      });
    } catch {
      toast.error("Failed to load visit data");
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching, isEdit, visitId]);

  useEffect(() => {
    fetchVisit();
  }, [fetchVisit]);

  type SectionKey = keyof Omit<VisitInput, "date">;

  const update =
    (section: SectionKey) =>
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setVisitData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as unknown as Record<string, unknown>),
          [field]: e.target.value,
        },
      }));
    };

  const handleSubmit = async () => {
    if (!actor) return;
    setSubmitting(true);
    try {
      if (isEdit) {
        await actor.updateVisit(BigInt(visitId), visitData);
        toast.success("Visit updated successfully");
      } else if (resolvedPatientId !== null) {
        await actor.createVisit(resolvedPatientId, visitData);
        toast.success("Visit saved successfully");
        navigate(`/patients/${Number(resolvedPatientId)}`);
        return;
      }
      navigate(`/patients/${Number(resolvedPatientId)}`);
    } catch {
      toast.error(isEdit ? "Failed to update visit" : "Failed to save visit");
    } finally {
      setSubmitting(false);
    }
  };

  const backHref = resolvedPatientId
    ? `/patients/${Number(resolvedPatientId)}`
    : "/";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const ch = update("caseHistory");
  const va = update("visualAcuity");
  const ce = update("clinicalExam");
  const seg = update("anteriorSegment");
  const st = update("specialTests");
  const dx = update("diagnosis");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            data-ocid="visit_form.back.button"
            variant="ghost"
            size="icon"
            onClick={() => navigate(backHref)}
            className="h-9 w-9"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEdit ? "Edit Examination" : "New Examination"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete ophthalmology clinical examination
            </p>
          </div>
        </div>
        <Button
          data-ocid="visit_form.save.primary_button"
          onClick={handleSubmit}
          disabled={submitting || !actor}
          className="gap-2"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {submitting ? "Saving..." : "Save Exam"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="case-history" className="space-y-4">
        <TabsList
          data-ocid="visit_form.tabs"
          className="flex flex-wrap h-auto gap-1 p-1"
        >
          <TabsTrigger
            data-ocid="visit_form.case_history.tab"
            value="case-history"
          >
            Case History
          </TabsTrigger>
          <TabsTrigger
            data-ocid="visit_form.visual_acuity.tab"
            value="visual-acuity"
          >
            Visual Acuity
          </TabsTrigger>
          <TabsTrigger
            data-ocid="visit_form.clinical_exam.tab"
            value="clinical-exam"
          >
            Clinical Exam
          </TabsTrigger>
          <TabsTrigger
            data-ocid="visit_form.anterior_segment.tab"
            value="anterior-segment"
          >
            Anterior Segment
          </TabsTrigger>
          <TabsTrigger
            data-ocid="visit_form.special_tests.tab"
            value="special-tests"
          >
            Special Tests
          </TabsTrigger>
          <TabsTrigger data-ocid="visit_form.diagnosis.tab" value="diagnosis">
            Diagnosis
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Case History */}
        <TabsContent value="case-history">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-5">
              Case History
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TAField
                label="Chief Complaint"
                value={visitData.caseHistory.chiefComplaint}
                onChange={ch("chiefComplaint")}
                ocid="visit_form.chief_complaint.textarea"
              />
              <TAField
                label="Glasses History"
                value={visitData.caseHistory.glassesHistory}
                onChange={ch("glassesHistory")}
              />
              <TAField
                label="Past, General Presenting (PGP)"
                value={visitData.caseHistory.pgp}
                onChange={ch("pgp")}
              />
              <TAField
                label="Consultation History"
                value={visitData.caseHistory.consultationHistory}
                onChange={ch("consultationHistory")}
              />
              <TAField
                label="Family History"
                value={visitData.caseHistory.familyHistory}
                onChange={ch("familyHistory")}
              />
              <TAField
                label="Trauma History"
                value={visitData.caseHistory.traumaHistory}
                onChange={ch("traumaHistory")}
              />
              <TAField
                label="Systemic Disease History"
                value={visitData.caseHistory.systemicDiseaseHistory}
                onChange={ch("systemicDiseaseHistory")}
              />
              <TAField
                label="Medication History"
                value={visitData.caseHistory.medicationHistory}
                onChange={ch("medicationHistory")}
              />
              <TAField
                label="Surgery History"
                value={visitData.caseHistory.surgeryHistory}
                onChange={ch("surgeryHistory")}
              />
              <TAField
                label="Allergy History"
                value={visitData.caseHistory.allergyHistory}
                onChange={ch("allergyHistory")}
              />
              <TAField
                label="Social History"
                value={visitData.caseHistory.socialHistory}
                onChange={ch("socialHistory")}
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Visual Acuity */}
        <TabsContent value="visual-acuity">
          <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-6">
            <h2 className="text-sm font-semibold text-foreground">
              Visual Acuity
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-semibold text-muted-foreground pb-2 w-32">
                      Measure
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground pb-2 pr-4">
                      OD (Right)
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground pb-2">
                      OS (Left)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["Distance", "distanceOD", "distanceOS"],
                      ["Near", "nearOD", "nearOS"],
                      ["Unaided", "unaidedOD", "unaidedOS"],
                      ["Pinhole", "pinholeOD", "pinholeOS"],
                    ] as [
                      string,
                      keyof typeof visitData.visualAcuity,
                      keyof typeof visitData.visualAcuity,
                    ][]
                  ).map(([label, od, os]) => (
                    <tr key={label}>
                      <td className="py-1.5 pr-4">
                        <span className="text-xs font-medium text-muted-foreground">
                          {label}
                        </span>
                      </td>
                      <td className="py-1.5 pr-4">
                        <Input
                          className="h-8 text-sm"
                          placeholder="6/6"
                          value={visitData.visualAcuity[od]}
                          onChange={va(od)}
                        />
                      </td>
                      <td className="py-1.5">
                        <Input
                          className="h-8 text-sm"
                          placeholder="6/6"
                          value={visitData.visualAcuity[os]}
                          onChange={va(os)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(
              [
                ["Previous Glasses", "previousGlasses"],
                ["Objective Refraction", "objectiveRefraction"],
                ["Subjective Refraction", "subjectiveRefraction"],
              ] as [string, keyof typeof visitData.visualAcuity][]
            ).map(([label, field]) => (
              <div key={label}>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  {label}
                </p>
                <Input
                  className="h-8 text-sm"
                  placeholder="Sph / Cyl / Axis (OD | OS)"
                  value={visitData.visualAcuity[field]}
                  onChange={va(field)}
                />
              </div>
            ))}

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                New Correction
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">OD</Label>
                  <Input
                    className="h-8 text-sm mt-1"
                    placeholder="Sph/Cyl/Axis"
                    value={visitData.visualAcuity.newCorrectionOD}
                    onChange={va("newCorrectionOD")}
                  />
                </div>
                <div>
                  <Label className="text-xs">OD VA</Label>
                  <Input
                    className="h-8 text-sm mt-1"
                    placeholder="6/6"
                    value={visitData.visualAcuity.newCorrectionODVa}
                    onChange={va("newCorrectionODVa")}
                  />
                </div>
                <div>
                  <Label className="text-xs">OS</Label>
                  <Input
                    className="h-8 text-sm mt-1"
                    placeholder="Sph/Cyl/Axis"
                    value={visitData.visualAcuity.newCorrectionOS}
                    onChange={va("newCorrectionOS")}
                  />
                </div>
                <div>
                  <Label className="text-xs">OS VA</Label>
                  <Input
                    className="h-8 text-sm mt-1"
                    placeholder="6/6"
                    value={visitData.visualAcuity.newCorrectionOSVa}
                    onChange={va("newCorrectionOSVa")}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Clinical Exam */}
        <TabsContent value="clinical-exam">
          <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-foreground">
              Clinical Examination
            </h2>

            <SectionTitle>Color Vision</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="OD"
                value={visitData.clinicalExam.colorVisionOD}
                onChange={ce("colorVisionOD")}
              />
              <InputField
                label="OS"
                value={visitData.clinicalExam.colorVisionOS}
                onChange={ce("colorVisionOS")}
              />
            </div>

            <SectionTitle>Keratometry</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Vertical"
                value={visitData.clinicalExam.keratometryVertical}
                onChange={ce("keratometryVertical")}
              />
              <InputField
                label="Horizontal"
                value={visitData.clinicalExam.keratometryHorizontal}
                onChange={ce("keratometryHorizontal")}
              />
              <InputField
                label="Comments"
                value={visitData.clinicalExam.keratometryComments}
                onChange={ce("keratometryComments")}
              />
            </div>

            <SectionTitle>Binocular Vision</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Cover Test"
                value={visitData.clinicalExam.coverTest}
                onChange={ce("coverTest")}
              />
              <InputField
                label="NPC Subjective"
                value={visitData.clinicalExam.npcSubjective}
                onChange={ce("npcSubjective")}
              />
              <InputField
                label="NPC Objective"
                value={visitData.clinicalExam.npcObjective}
                onChange={ce("npcObjective")}
              />
              <InputField
                label="EOM"
                value={visitData.clinicalExam.eom}
                onChange={ce("eom")}
              />
            </div>

            <SectionTitle>Near Point of Accommodation</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="NPA OD"
                value={visitData.clinicalExam.npaOD}
                onChange={ce("npaOD")}
              />
              <InputField
                label="NPA OS"
                value={visitData.clinicalExam.npaOS}
                onChange={ce("npaOS")}
              />
              <InputField
                label="NPA OU"
                value={visitData.clinicalExam.npaOU}
                onChange={ce("npaOU")}
              />
              <InputField
                label="WFDT"
                value={visitData.clinicalExam.wfdt}
                onChange={ce("wfdt")}
              />
              <InputField
                label="Stereopsis"
                value={visitData.clinicalExam.stereopsis}
                onChange={ce("stereopsis")}
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Anterior Segment */}
        <TabsContent value="anterior-segment">
          <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-foreground">
              Anterior Segment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Pupillary Evaluation"
                value={visitData.anteriorSegment.pupillaryEvaluation}
                onChange={seg("pupillaryEvaluation")}
              />
              <InputField
                label="External Exam"
                value={visitData.anteriorSegment.externalExam}
                onChange={seg("externalExam")}
              />
              <InputField
                label="Palpebral Fissure Height"
                value={visitData.anteriorSegment.palpebralFissureHeight}
                onChange={seg("palpebralFissureHeight")}
              />
            </div>

            <SectionTitle>Slit Lamp Examination</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground pb-2 w-44">
                      Structure
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground pb-2 pr-4">
                      OD (Right)
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground pb-2">
                      OS (Left)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["Ocular Adnexa", "ocularAdnexaOD", "ocularAdnexaOS"],
                      ["Cornea", "corneaOD", "corneaOS"],
                      ["Conjunctiva", "conjunctivaOD", "conjunctivaOS"],
                      ["Sclera", "scleraOD", "scleraOS"],
                      [
                        "Anterior Chamber",
                        "anteriorChamberOD",
                        "anteriorChamberOS",
                      ],
                      ["Iris", "irisOD", "irisOS"],
                      ["Pupil", "pupilOD", "pupilOS"],
                      ["Lens", "lensOD", "lensOS"],
                    ] as [
                      string,
                      keyof typeof visitData.anteriorSegment,
                      keyof typeof visitData.anteriorSegment,
                    ][]
                  ).map(([label, od, os]) => (
                    <tr
                      key={label}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-2 pr-4">
                        <span className="text-xs font-medium text-muted-foreground">
                          {label}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          className="h-7 text-xs"
                          value={visitData.anteriorSegment[od]}
                          onChange={seg(od)}
                        />
                      </td>
                      <td className="py-2">
                        <Input
                          className="h-7 text-xs"
                          value={visitData.anteriorSegment[os]}
                          onChange={seg(os)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 5: Special Tests */}
        <TabsContent value="special-tests">
          <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-foreground">
              Special Tests
            </h2>

            <SectionTitle>Tonometry</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputField
                label="Method"
                value={visitData.specialTests.tonometryMethod}
                onChange={st("tonometryMethod")}
              />
              <InputField
                label="Time"
                value={visitData.specialTests.tonometryTime}
                onChange={st("tonometryTime")}
              />
              <InputField
                label="OD"
                value={visitData.specialTests.tonometryOD}
                onChange={st("tonometryOD")}
              />
              <InputField
                label="OS"
                value={visitData.specialTests.tonometryOS}
                onChange={st("tonometryOS")}
              />
            </div>

            <InputField
              label="Gonioscopy"
              value={visitData.specialTests.gonioscopy}
              onChange={st("gonioscopy")}
            />

            <SectionTitle>TBUT</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="OD"
                value={visitData.specialTests.tbutOD}
                onChange={st("tbutOD")}
              />
              <InputField
                label="OS"
                value={visitData.specialTests.tbutOS}
                onChange={st("tbutOS")}
              />
            </div>

            <SectionTitle>Schirmer Test</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="OD"
                value={visitData.specialTests.schirmerOD}
                onChange={st("schirmerOD")}
              />
              <InputField
                label="OS"
                value={visitData.specialTests.schirmerOS}
                onChange={st("schirmerOS")}
              />
            </div>

            <SectionTitle>Syringing</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="OD"
                value={visitData.specialTests.syringingOD}
                onChange={st("syringingOD")}
              />
              <InputField
                label="OS"
                value={visitData.specialTests.syringingOS}
                onChange={st("syringingOS")}
              />
            </div>

            <SectionTitle>ROPLAS</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="OD"
                value={visitData.specialTests.roplasOD}
                onChange={st("roplasOD")}
              />
              <InputField
                label="OS"
                value={visitData.specialTests.roplasOS}
                onChange={st("roplasOS")}
              />
            </div>

            <TAField
              label="Other Procedures"
              value={visitData.specialTests.otherProcedures}
              onChange={st("otherProcedures")}
            />
            <TAField
              label="Dilation Instructions"
              value={visitData.specialTests.dilationInstructions}
              onChange={st("dilationInstructions")}
            />
          </div>
        </TabsContent>

        {/* Tab 6: Diagnosis */}
        <TabsContent value="diagnosis">
          <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-foreground">
              Diagnosis &amp; Management
            </h2>
            <TAField
              label="Diagnosis"
              value={visitData.diagnosis.diagnosis}
              onChange={dx("diagnosis")}
              rows={4}
              ocid="visit_form.diagnosis.textarea"
            />
            <TAField
              label="Intervention / Management Plan"
              value={visitData.diagnosis.intervention}
              onChange={dx("intervention")}
              rows={4}
              ocid="visit_form.intervention.textarea"
            />
            <TAField
              label="Learning Notes"
              value={visitData.diagnosis.learningNotes}
              onChange={dx("learningNotes")}
              rows={3}
              ocid="visit_form.learning_notes.textarea"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-2">
        <Button
          data-ocid="visit_form.save_bottom.primary_button"
          onClick={handleSubmit}
          disabled={submitting || !actor}
          className="gap-2"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {submitting ? "Saving..." : "Save Exam"}
        </Button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">
        {children}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  ocid,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ocid?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        data-ocid={ocid}
        className="h-8 text-sm"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function TAField({
  label,
  value,
  onChange,
  rows = 2,
  ocid,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  ocid?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Textarea
        data-ocid={ocid}
        className="text-sm resize-none"
        rows={rows}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
