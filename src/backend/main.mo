import Time "mo:core/Time";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Patient = {
    id : Nat;
    name : Text;
    age : Nat;
    gender : Text;
    registrationNumber : Text;
    mrdNumber : Text;
    occupation : ?Text;
    contactNumber : Text;
    address : ?Text;
    email : ?Text;
    createdAt : Int;
    updatedAt : Int;
    owner : Principal;
  };

  type CaseHistory = {
    chiefComplaint : Text;
    glassesHistory : Text;
    pgp : Text;
    consultationHistory : Text;
    familyHistory : Text;
    traumaHistory : Text;
    systemicDiseaseHistory : Text;
    medicationHistory : Text;
    surgeryHistory : Text;
    allergyHistory : Text;
    socialHistory : Text;
  };

  type VisualAcuity = {
    distanceOD : Text;
    distanceOS : Text;
    nearOD : Text;
    nearOS : Text;
    unaidedOD : Text;
    unaidedOS : Text;
    pinholeOD : Text;
    pinholeOS : Text;
    previousGlasses : Text;
    objectiveRefraction : Text;
    subjectiveRefraction : Text;
    newCorrectionOD : Text;
    newCorrectionOS : Text;
    newCorrectionODVa : Text;
    newCorrectionOSVa : Text;
  };

  type ClinicalExam = {
    colorVisionOD : Text;
    colorVisionOS : Text;
    keratometryVertical : Text;
    keratometryHorizontal : Text;
    keratometryComments : Text;
    coverTest : Text;
    npcSubjective : Text;
    npcObjective : Text;
    eom : Text;
    npaOD : Text;
    npaOS : Text;
    npaOU : Text;
    wfdt : Text;
    stereopsis : Text;
  };

  type AnteriorSegment = {
    pupillaryEvaluation : Text;
    externalExam : Text;
    palpebralFissureHeight : Text;
    ocularAdnexaOD : Text;
    ocularAdnexaOS : Text;
    corneaOD : Text;
    corneaOS : Text;
    conjunctivaOD : Text;
    conjunctivaOS : Text;
    scleraOD : Text;
    scleraOS : Text;
    anteriorChamberOD : Text;
    anteriorChamberOS : Text;
    irisOD : Text;
    irisOS : Text;
    pupilOD : Text;
    pupilOS : Text;
    lensOD : Text;
    lensOS : Text;
  };

  type SpecialTests = {
    tonometryMethod : Text;
    tonometryTime : Text;
    tonometryOD : Text;
    tonometryOS : Text;
    gonioscopy : Text;
    tbutOD : Text;
    tbutOS : Text;
    schirmerOD : Text;
    schirmerOS : Text;
    syringingOD : Text;
    syringingOS : Text;
    roplasOD : Text;
    roplasOS : Text;
    otherProcedures : Text;
    dilationInstructions : Text;
  };

  type Diagnosis = {
    diagnosis : Text;
    intervention : Text;
    learningNotes : Text;
  };

  type Visit = {
    id : Nat;
    patientId : Nat;
    date : Int;
    caseHistory : CaseHistory;
    visualAcuity : VisualAcuity;
    clinicalExam : ClinicalExam;
    anteriorSegment : AnteriorSegment;
    specialTests : SpecialTests;
    diagnosis : Diagnosis;
    owner : Principal;
  };

  type PatientInput = {
    name : Text;
    age : Nat;
    gender : Text;
    registrationNumber : Text;
    mrdNumber : Text;
    occupation : ?Text;
    contactNumber : Text;
    address : ?Text;
    email : ?Text;
  };

  type VisitInput = {
    date : Int;
    caseHistory : CaseHistory;
    visualAcuity : VisualAcuity;
    clinicalExam : ClinicalExam;
    anteriorSegment : AnteriorSegment;
    specialTests : SpecialTests;
    diagnosis : Diagnosis;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    specialty : ?Text;
  };

  module Patient {
    public func compare(p1 : (Nat, Patient), p2 : (Nat, Patient)) : Order.Order {
      Nat.compare(p1.0, p2.0);
    };
  };

  module Visit {
    public func compare(v1 : (Nat, Visit), v2 : (Nat, Visit)) : Order.Order {
      Nat.compare(v1.0, v2.0);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let patients = Map.empty<Nat, Patient>();
  let visits = Map.empty<Nat, Visit>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var patientIdCounter = 0;
  var visitIdCounter = 0;

  func getNextPatientId() : Nat {
    patientIdCounter += 1;
    patientIdCounter;
  };

  func getNextVisitId() : Nat {
    visitIdCounter += 1;
    visitIdCounter;
  };

  func getPatientByIdInternal(id : Nat) : Patient {
    switch (patients.get(id)) {
      case (null) { Runtime.trap("Patient not found") };
      case (?patient) { patient };
    };
  };

  func getVisitByIdInternal(id : Nat) : Visit {
    switch (visits.get(id)) {
      case (null) { Runtime.trap("Visit not found") };
      case (?visit) { visit };
    };
  };

  func isRegisteredUser(caller : Principal) : Bool {
    if (caller.isAnonymous()) { return false };
    switch (accessControlState.userRoles.get(caller)) {
      case (null) { false };
      case (?_) { true };
    };
  };

  func isAdminOrOwner(caller : Principal, owner : Principal) : Bool {
    caller == owner or AccessControl.isAdmin(accessControlState, caller);
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) { return null };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Must be logged in to save profile");
    };
    userProfiles.add(caller, profile);
  };

  // Patient Functions
  // NOTE: Read query functions do NOT require role registration to avoid ICP query/update
  // race conditions. Data isolation is enforced via owner == caller filtering.
  public query ({ caller }) func getPatient(id : Nat) : async Patient {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let patient = getPatientByIdInternal(id);
    if (not isAdminOrOwner(caller, patient.owner)) {
      Runtime.trap("Unauthorized: Can only view your own patients");
    };
    patient;
  };

  public query ({ caller }) func getCallerPatients() : async [Patient] {
    // Anonymous callers get empty list; unregistered callers also get empty list.
    // Data isolation is enforced by filtering on owner == caller.
    if (caller.isAnonymous()) { return [] };
    patients.toArray().filter(func((_, patient)) { patient.owner == caller }).map(func((_, patient)) { patient });
  };

  public shared ({ caller }) func createPatient(input : PatientInput) : async Nat {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only users can create patients");
    };
    if (input.name == "" or input.registrationNumber == "") {
      Runtime.trap("Name and Registration Number are required");
    };
    let id = getNextPatientId();
    let now = Time.now();
    let patient : Patient = {
      id = id;
      name = input.name;
      age = input.age;
      gender = input.gender;
      registrationNumber = input.registrationNumber;
      mrdNumber = input.mrdNumber;
      occupation = input.occupation;
      contactNumber = input.contactNumber;
      address = input.address;
      email = input.email;
      createdAt = now;
      updatedAt = now;
      owner = caller;
    };
    patients.add(id, patient);
    id;
  };

  public shared ({ caller }) func updatePatient(id : Nat, input : PatientInput) : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only users can update patients");
    };
    let existingPatient = getPatientByIdInternal(id);
    if (not isAdminOrOwner(caller, existingPatient.owner)) {
      Runtime.trap("Unauthorized: Can only update your own patients");
    };
    patients.add(
      id,
      {
        id = existingPatient.id;
        name = input.name;
        age = input.age;
        gender = input.gender;
        registrationNumber = input.registrationNumber;
        mrdNumber = input.mrdNumber;
        occupation = input.occupation;
        contactNumber = input.contactNumber;
        address = input.address;
        email = input.email;
        createdAt = existingPatient.createdAt;
        updatedAt = Time.now();
        owner = existingPatient.owner;
      },
    );
  };

  public shared ({ caller }) func deletePatient(id : Nat) : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only users can delete patients");
    };
    let patient = getPatientByIdInternal(id);
    if (not isAdminOrOwner(caller, patient.owner)) {
      Runtime.trap("Unauthorized: Can only delete your own patients");
    };
    patients.remove(id);
  };

  // Visit Functions
  public query ({ caller }) func getVisit(id : Nat) : async Visit {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let visit = getVisitByIdInternal(id);
    if (not isAdminOrOwner(caller, visit.owner)) {
      Runtime.trap("Unauthorized: Can only view your own visits");
    };
    visit;
  };

  public query ({ caller }) func getVisitsByPatient(patientId : Nat) : async [Visit] {
    if (caller.isAnonymous()) { return [] };
    let patient = getPatientByIdInternal(patientId);
    if (not isAdminOrOwner(caller, patient.owner)) {
      Runtime.trap("Unauthorized: Can only view visits for your own patients");
    };
    visits.toArray().filter(func((_, visit)) { visit.patientId == patientId and visit.owner == caller }).map(func((_, visit)) { visit });
  };

  public shared ({ caller }) func createVisit(patientId : Nat, input : VisitInput) : async Nat {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only users can create visits");
    };
    let patient = getPatientByIdInternal(patientId);
    if (not isAdminOrOwner(caller, patient.owner)) {
      Runtime.trap("Unauthorized: Can only create visits for your own patients");
    };
    let id = getNextVisitId();
    let newVisit : Visit = {
      id = id;
      patientId = patientId;
      date = input.date;
      caseHistory = input.caseHistory;
      visualAcuity = input.visualAcuity;
      clinicalExam = input.clinicalExam;
      anteriorSegment = input.anteriorSegment;
      specialTests = input.specialTests;
      diagnosis = input.diagnosis;
      owner = caller;
    };
    visits.add(id, newVisit);
    id;
  };

  public shared ({ caller }) func updateVisit(id : Nat, input : VisitInput) : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only users can update visits");
    };
    let existingVisit = getVisitByIdInternal(id);
    if (not isAdminOrOwner(caller, existingVisit.owner)) {
      Runtime.trap("Unauthorized: Can only update your own visits");
    };
    let updatedVisit : Visit = {
      id = existingVisit.id;
      patientId = existingVisit.patientId;
      date = input.date;
      caseHistory = input.caseHistory;
      visualAcuity = input.visualAcuity;
      clinicalExam = input.clinicalExam;
      anteriorSegment = input.anteriorSegment;
      specialTests = input.specialTests;
      diagnosis = input.diagnosis;
      owner = existingVisit.owner;
    };
    visits.add(id, updatedVisit);
  };

  public shared ({ caller }) func deleteVisit(id : Nat) : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only users can delete visits");
    };
    let visit = getVisitByIdInternal(id);
    if (not isAdminOrOwner(caller, visit.owner)) {
      Runtime.trap("Unauthorized: Can only delete your own visits");
    };
    visits.remove(id);
  };
};
