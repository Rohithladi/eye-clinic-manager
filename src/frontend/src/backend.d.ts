import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Patient {
    id: bigint;
    age: bigint;
    occupation?: string;
    owner: Principal;
    name: string;
    createdAt: bigint;
    mrdNumber: string;
    registrationNumber: string;
    email?: string;
    updatedAt: bigint;
    address?: string;
    gender: string;
    contactNumber: string;
}
export interface Diagnosis {
    learningNotes: string;
    intervention: string;
    diagnosis: string;
}
export interface ClinicalExam {
    eom: string;
    keratometryComments: string;
    npcSubjective: string;
    colorVisionOD: string;
    colorVisionOS: string;
    keratometryHorizontal: string;
    wfdt: string;
    npaOD: string;
    npaOS: string;
    npaOU: string;
    stereopsis: string;
    keratometryVertical: string;
    coverTest: string;
    npcObjective: string;
}
export interface AnteriorSegment {
    externalExam: string;
    corneaOD: string;
    corneaOS: string;
    scleraOD: string;
    scleraOS: string;
    pupillaryEvaluation: string;
    anteriorChamberOD: string;
    anteriorChamberOS: string;
    palpebralFissureHeight: string;
    lensOD: string;
    lensOS: string;
    conjunctivaOD: string;
    conjunctivaOS: string;
    pupilOD: string;
    pupilOS: string;
    ocularAdnexaOD: string;
    ocularAdnexaOS: string;
    irisOD: string;
    irisOS: string;
}
export interface PatientInput {
    age: bigint;
    occupation?: string;
    name: string;
    mrdNumber: string;
    registrationNumber: string;
    email?: string;
    address?: string;
    gender: string;
    contactNumber: string;
}
export interface SpecialTests {
    tonometryMethod: string;
    tbutOD: string;
    tbutOS: string;
    gonioscopy: string;
    tonometryOD: string;
    tonometryOS: string;
    dilationInstructions: string;
    tonometryTime: string;
    otherProcedures: string;
    roplasOD: string;
    roplasOS: string;
    schirmerOD: string;
    schirmerOS: string;
    syringingOD: string;
    syringingOS: string;
}
export interface VisualAcuity {
    newCorrectionODVa: string;
    newCorrectionOSVa: string;
    nearOD: string;
    nearOS: string;
    pinholeOD: string;
    pinholeOS: string;
    distanceOD: string;
    distanceOS: string;
    unaidedOD: string;
    unaidedOS: string;
    newCorrectionOD: string;
    newCorrectionOS: string;
    objectiveRefraction: string;
    previousGlasses: string;
    subjectiveRefraction: string;
}
export interface CaseHistory {
    pgp: string;
    glassesHistory: string;
    traumaHistory: string;
    surgeryHistory: string;
    allergyHistory: string;
    familyHistory: string;
    medicationHistory: string;
    socialHistory: string;
    systemicDiseaseHistory: string;
    consultationHistory: string;
    chiefComplaint: string;
}
export interface Visit {
    id: bigint;
    caseHistory: CaseHistory;
    owner: Principal;
    patientId: bigint;
    date: bigint;
    anteriorSegment: AnteriorSegment;
    specialTests: SpecialTests;
    diagnosis: Diagnosis;
    visualAcuity: VisualAcuity;
    clinicalExam: ClinicalExam;
}
export interface UserProfile {
    name: string;
    email?: string;
    specialty?: string;
}
export interface VisitInput {
    caseHistory: CaseHistory;
    date: bigint;
    anteriorSegment: AnteriorSegment;
    specialTests: SpecialTests;
    diagnosis: Diagnosis;
    visualAcuity: VisualAcuity;
    clinicalExam: ClinicalExam;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPatient(input: PatientInput): Promise<bigint>;
    createVisit(patientId: bigint, input: VisitInput): Promise<bigint>;
    deletePatient(id: bigint): Promise<void>;
    deleteVisit(id: bigint): Promise<void>;
    getCallerPatients(): Promise<Array<Patient>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPatient(id: bigint): Promise<Patient>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisit(id: bigint): Promise<Visit>;
    getVisitsByPatient(patientId: bigint): Promise<Array<Visit>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePatient(id: bigint, input: PatientInput): Promise<void>;
    updateVisit(id: bigint, input: VisitInput): Promise<void>;
}
