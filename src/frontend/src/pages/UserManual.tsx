import { useNavigate } from "../router";

function Section({
  id,
  title,
  children,
}: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-bold text-slate-800 border-b-2 border-blue-600 pb-2 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-base font-semibold text-slate-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border border-slate-200 rounded">
        <thead>
          <tr className="bg-blue-600 text-white">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={row[0]}
              className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}
            >
              {row.map((cell) => (
                <td
                  key={cell}
                  className="px-4 py-2 border-t border-slate-100 align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Notice({
  type,
  children,
}: { type: "important" | "note"; children: React.ReactNode }) {
  const styles =
    type === "important"
      ? "bg-red-50 border-l-4 border-red-500 text-red-800"
      : "bg-blue-50 border-l-4 border-blue-500 text-blue-800";
  return (
    <div className={`${styles} p-4 rounded-r mb-4 text-sm`}>
      <span className="font-bold uppercase text-xs tracking-wide block mb-1">
        {type === "important" ? "Important" : "Note"}
      </span>
      {children}
    </div>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 mb-4 pl-2">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}

export default function UserManual() {
  const navigate = useNavigate();
  const toc = [
    { num: "1", title: "Introduction", id: "introduction" },
    { num: "2", title: "System Requirements", id: "system-requirements" },
    { num: "3", title: "Getting Started", id: "getting-started" },
    { num: "4", title: "Patient Dashboard", id: "patient-dashboard" },
    {
      num: "5",
      title: "New Patient Registration",
      id: "new-patient-registration",
    },
    { num: "6", title: "Patient Profile", id: "patient-profile" },
    {
      num: "7",
      title: "New Clinical Examination",
      id: "new-clinical-examination",
    },
    { num: "8", title: "Case History", id: "case-history" },
    { num: "9", title: "Visual Acuity", id: "visual-acuity" },
    { num: "10", title: "Anterior Segment", id: "anterior-segment" },
    { num: "11", title: "Special Tests — Tonometry", id: "special-tests" },
    { num: "12", title: "Fundus", id: "fundus" },
    { num: "13", title: "Diagnosis", id: "diagnosis" },
    { num: "14", title: "Save Record", id: "save-record" },
    { num: "15", title: "Troubleshooting", id: "troubleshooting" },
    { num: "16", title: "Frequently Asked Questions", id: "faq" },
    { num: "17", title: "Glossary", id: "glossary" },
    { num: "18", title: "Copyright & Disclaimer", id: "copyright" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between print:bg-blue-700">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Eye Clinic Manager
          </h1>
          <p className="text-blue-200 text-sm mt-0.5">
            User Manual — Clinical Eye Care Management System
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition-colors print:hidden"
        >
          ← Back to App
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Table of Contents */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
            Table of Contents
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.num}. {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 space-y-2">
          {/* 1. Introduction */}
          <Section id="introduction" title="1. Introduction">
            <p className="text-sm text-slate-700 mb-3">
              Welcome to <strong>Eye Clinic Manager</strong> — a clinical eye
              care management system designed for optometrists and eye care
              professionals. Eye Clinic Manager provides a secure, user-specific
              digital platform to manage patient records, conduct comprehensive
              clinical examinations, and maintain complete clinical histories —
              all from any modern web browser.
            </p>
            <p className="text-sm text-slate-700 mb-3">This manual covers:</p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-4 pl-2">
              <li>Logging in securely using Internet Identity</li>
              <li>Navigating the interface and Patient Dashboard</li>
              <li>Registering new patients</li>
              <li>Opening and managing patient profiles</li>
              <li>
                Conducting a full clinical examination — Case History, Visual
                Acuity, Anterior Segment, Special Tests, Fundus, and Diagnosis
              </li>
              <li>Saving and reviewing examination records</li>
              <li>Troubleshooting and frequently asked questions</li>
            </ul>
            <Notice type="important">
              Eye Clinic Manager is a clinical record-keeping and examination
              tool intended for use by licensed optometrists and trained eye
              care professionals. All clinical decisions, diagnoses, and
              management plans are the sole responsibility of the examining
              clinician.
            </Notice>
          </Section>

          {/* 2. System Requirements */}
          <Section id="system-requirements" title="2. System Requirements">
            <p className="text-sm text-slate-700 mb-3">
              Eye Clinic Manager is a browser-based web application — no
              installation or download is required. Ensure your device meets the
              following requirements before use:
            </p>
            <Table
              headers={["Requirement", "Details"]}
              rows={[
                [
                  "Web Browser",
                  "Google Chrome 90+, Mozilla Firefox 88+, Safari 14+, Microsoft Edge 90+",
                ],
                [
                  "Internet Connection",
                  "Stable broadband connection (minimum 5 Mbps recommended)",
                ],
                [
                  "Screen Resolution",
                  "1280 × 720 minimum; 1920 × 1080 recommended",
                ],
                [
                  "Operating System",
                  "Windows 10+, macOS 11+, iOS 14+, Android 10+",
                ],
                ["JavaScript", "Must be enabled in your browser settings"],
                ["Cookies", "Must be allowed for session management"],
              ]}
            />
          </Section>

          {/* 3. Getting Started */}
          <Section id="getting-started" title="3. Getting Started">
            <SubSection title="3.1 Accessing Eye Clinic Manager">
              <p className="text-sm text-slate-700 mb-3">
                To open Eye Clinic Manager, follow these steps:
              </p>
              <div className="space-y-3 mb-4">
                {[
                  [
                    "1",
                    "Open your web browser",
                    "Launch Google Chrome, Firefox, Safari, or Microsoft Edge on your device.",
                  ],
                  [
                    "2",
                    "Go to the application URL",
                    "In the address bar, type the Eye Clinic Manager URL provided to you and press Enter.",
                  ],
                  [
                    "3",
                    "Application loads",
                    "The login screen will appear within a few seconds. Ensure your internet connection is active.",
                  ],
                  [
                    "4",
                    "Log in with Internet Identity",
                    "Click the Log In button and follow the Internet Identity authentication prompts to verify your identity securely.",
                  ],
                  [
                    "5",
                    "Begin working",
                    "After logging in, the Patient Dashboard will load. You can now register patients, search existing records, or view today's clinic statistics.",
                  ],
                ].map(([num, heading, desc]) => (
                  <div key={num} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                      {num}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {heading}
                      </p>
                      <p className="text-sm text-slate-600">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>
            <SubSection title="3.2 Internet Identity Authentication">
              <p className="text-sm text-slate-700 mb-3">
                Eye Clinic Manager uses <strong>Internet Identity</strong> — a
                cryptographically secure, passwordless authentication system
                provided by the Internet Computer. Your patient data is private
                and only accessible to your authenticated identity.
              </p>
              <Notice type="note">
                If you are using Internet Identity for the first time, you will
                be prompted to create an anchor (a unique number) and register a
                device such as your fingerprint, Face ID, or a security key.
                Keep your anchor number safe — you will need it each time you
                log in.
              </Notice>
            </SubSection>
            <SubSection title="3.3 Navigation">
              <Table
                headers={["Element", "Description"]}
                rows={[
                  [
                    "Eye Clinic Manager Logo",
                    "Displayed in the top-left corner of every screen. Identifies the application.",
                  ],
                  [
                    "Sidebar Menu",
                    "The left-side panel providing navigation links to the Dashboard and other sections.",
                  ],
                  [
                    "Log Out Button",
                    "Located at the bottom of the sidebar. Click to securely end your session.",
                  ],
                  [
                    "Back Arrow (←)",
                    "Appears on inner screens. Click to return to the previous screen.",
                  ],
                ]}
              />
            </SubSection>
          </Section>

          {/* 4. Patient Dashboard */}
          <Section id="patient-dashboard" title="4. Patient Dashboard">
            <p className="text-sm text-slate-700 mb-3">
              The Patient Dashboard is the home screen of Eye Clinic Manager. It
              provides an overview of clinic activity and gives access to all
              key functions.
            </p>
            <SubSection title="4.1 Dashboard Elements">
              <Table
                headers={["Element", "Description"]}
                rows={[
                  [
                    "New Patient",
                    "A blue button at the top of the dashboard. Click to open the New Patient registration form.",
                  ],
                  [
                    "Total Patients",
                    "Displays the total number of patients currently registered in the system.",
                  ],
                  [
                    "Visits Today",
                    "Shows the number of clinical visits recorded for the current date.",
                  ],
                  [
                    "Pending Reports",
                    "Shows the number of examination records that have been started but not yet finalised.",
                  ],
                  [
                    "Search Bar",
                    'Labelled "Search patients..." — use this to locate any patient by name, ID, or phone number.',
                  ],
                  [
                    "Patient Table",
                    "Lists all registered patients with columns: Patient Name, Age, Phone, and Actions.",
                  ],
                ]}
              />
            </SubSection>
          </Section>

          {/* 5. New Patient Registration */}
          <Section
            id="new-patient-registration"
            title="5. New Patient Registration"
          >
            <p className="text-sm text-slate-700 mb-3">
              Before a clinical examination can be conducted, the patient must
              be registered in Eye Clinic Manager. The New Patient form captures
              all essential demographic and contact details.
            </p>
            <SubSection title="5.1 Opening the New Patient Form">
              <Steps
                items={[
                  "From the Patient Dashboard, click the blue New Patient button.",
                  "The New Patient registration form will open.",
                ]}
              />
            </SubSection>
            <SubSection title="5.2 Registration Form Fields">
              <Table
                headers={["Field", "Description"]}
                rows={[
                  ["Full Name", "Enter the patient's full name."],
                  ["Age", "Enter the patient's age in years."],
                  [
                    "Gender",
                    "Select from the dropdown: Male, Female, or Other.",
                  ],
                  ["Phone Number", "Enter the patient's contact number."],
                  [
                    "Email (Optional)",
                    "Enter the patient's email address if available.",
                  ],
                  ["Occupation", "Enter the patient's current occupation."],
                  ["Address", "Enter the patient's residential address."],
                ]}
              />
            </SubSection>
            <SubSection title="5.3 Completing Registration">
              <Steps
                items={[
                  "Fill in all required fields in the form.",
                  "Click the blue Register Patient button at the bottom to save the new patient record.",
                  "To discard the form without saving, click Cancel.",
                  "Once registered, the patient appears in the Patient Dashboard table.",
                ]}
              />
            </SubSection>
          </Section>

          {/* 6. Patient Profile */}
          <Section id="patient-profile" title="6. Patient Profile">
            <p className="text-sm text-slate-700 mb-3">
              The Patient Profile screen displays all stored information for a
              selected patient and provides access to their clinical history and
              examination records.
            </p>
            <SubSection title="6.1 Opening a Patient Profile">
              <Steps
                items={[
                  "From the Patient Dashboard, locate the patient using the search bar or patient table.",
                  "Click the patient's name or the view icon in the Actions column.",
                  "The Patient Profile screen will open.",
                ]}
              />
            </SubSection>
            <SubSection title="6.2 Patient Profile Contents">
              <Table
                headers={["Section", "Description"]}
                rows={[
                  [
                    "Patient Header",
                    "Displays the patient's name, age, and gender.",
                  ],
                  [
                    "Contact Information",
                    'Shows the patient\'s phone number, occupation, and address. Fields not provided at registration are shown as "Not listed".',
                  ],
                  [
                    "Clinical History",
                    "Lists all past clinical examinations for this patient in chronological order. When no examinations exist, a prompt to start a new examination is displayed.",
                  ],
                  [
                    "Start New Exam",
                    "A blue button in the header. Click to begin a new clinical examination for this patient.",
                  ],
                ]}
              />
            </SubSection>
          </Section>

          {/* 7. New Clinical Examination */}
          <Section
            id="new-clinical-examination"
            title="7. New Clinical Examination"
          >
            <p className="text-sm text-slate-700 mb-3">
              The New Clinical Examination screen is the main examination
              workflow in Eye Clinic Manager. It is divided into six sections
              accessible via a tab bar: Case History, Visual Acuity, Clinical
              Exam (Anterior Segment), Special Tests, Fundus, and Diagnosis &
              Management.
            </p>
            <SubSection title="7.1 Opening a New Clinical Examination">
              <Steps
                items={[
                  "From the Patient Profile, click the blue Start New Exam button in the header.",
                  "The New Clinical Examination screen will open, showing the patient's details and the section tab bar.",
                ]}
              />
            </SubSection>
            <SubSection title="7.2 Examination Screen Elements">
              <Table
                headers={["Element", "Description"]}
                rows={[
                  [
                    "Title",
                    '"New Clinical Examination" — confirms a new exam session is active.',
                  ],
                  [
                    "Patient Info",
                    "Displays the patient's name and identifier below the title for reference throughout the examination.",
                  ],
                  [
                    "Save Record",
                    "A blue button in the top-right corner. Click at any time to save all data entered across all sections.",
                  ],
                  [
                    "Back Arrow (←)",
                    "Returns to the Patient Profile. Always click Save Record first to avoid losing data.",
                  ],
                  [
                    "Section Tab Bar",
                    "A tab bar at the top of the examination area containing all six section names. Click any tab to navigate to it.",
                  ],
                ]}
              />
            </SubSection>
            <SubSection title="7.3 Examination Sections">
              <Table
                headers={["Section", "Purpose"]}
                rows={[
                  [
                    "Case History",
                    "Record the patient's presenting complaint and relevant background information.",
                  ],
                  ["Visual Acuity", "Enter vision measurements for both eyes."],
                  [
                    "Clinical Exam (Anterior Segment)",
                    "Record slit lamp examination findings for both eyes.",
                  ],
                  [
                    "Special Tests",
                    "Record tonometry (intraocular pressure) measurements.",
                  ],
                  [
                    "Fundus",
                    "Draw and annotate posterior segment findings for both eyes.",
                  ],
                  [
                    "Diagnosis & Management",
                    "Enter the final diagnosis and management plan.",
                  ],
                ]}
              />
              <Notice type="note">
                You can navigate between sections in any order. Data entered in
                all sections is saved together when you click Save Record.
                Always save before leaving the examination screen.
              </Notice>
            </SubSection>
          </Section>

          {/* 8. Case History */}
          <Section id="case-history" title="8. Case History">
            <p className="text-sm text-slate-700 mb-3">
              The Case History section captures the patient's presenting
              complaint and relevant background information at the start of the
              clinical examination.
            </p>
            <SubSection title="8.1 Fields">
              <Table
                headers={["Field", "Description"]}
                rows={[
                  [
                    "Chief Complaint (CO)",
                    "The patient's main presenting problem, described in the patient's own words.",
                  ],
                  [
                    "History of Glasses",
                    "Any history of spectacle or contact lens wear, including duration and type of correction.",
                  ],
                  [
                    "Systemic History (Diabetes/HTN)",
                    "Relevant systemic medical conditions such as Diabetes Mellitus, Hypertension, or other conditions with known ocular implications.",
                  ],
                ]}
              />
            </SubSection>
            <SubSection title="8.2 How to Use">
              <Steps
                items={[
                  "Click Case History in the section tab bar.",
                  "Click the Chief Complaint (CO) field and enter the patient's presenting complaint.",
                  "Click the History of Glasses field and enter any history of spectacle or contact lens use.",
                  "Click the Systemic History field and enter any relevant medical conditions.",
                  "Click Save Record to save your entries, or proceed to the next section.",
                ]}
              />
            </SubSection>
          </Section>

          {/* 9. Visual Acuity */}
          <Section id="visual-acuity" title="9. Visual Acuity">
            <p className="text-sm text-slate-700 mb-3">
              The Visual Acuity section records vision measurements for both the
              right eye (OD — Oculus Dexter) and the left eye (OS — Oculus
              Sinister).
            </p>
            <SubSection title="9.1 Fields">
              <Table
                headers={["Parameter", "OD (Right Eye)", "OS (Left Eye)"]}
                rows={[
                  [
                    "Distance Vision",
                    "Enter the distance vision measurement for the right eye.",
                    "Enter the distance vision measurement for the left eye.",
                  ],
                  [
                    "Near Vision",
                    "Enter the near vision measurement for the right eye.",
                    "Enter the near vision measurement for the left eye.",
                  ],
                  [
                    "Unaided Vision",
                    "Enter the unaided vision for the right eye.",
                    "Enter the unaided vision for the left eye.",
                  ],
                  [
                    "Pinhole Vision",
                    "Enter the pinhole vision for the right eye.",
                    "Enter the pinhole vision for the left eye.",
                  ],
                ]}
              />
            </SubSection>
            <SubSection title="9.2 How to Use">
              <Steps
                items={[
                  "Click Visual Acuity in the section tab bar.",
                  "The section displays a table with four rows — Distance Vision, Near Vision, Unaided Vision, and Pinhole Vision — and two columns for OD and OS.",
                  "Click any cell in the table to enter the value for that measurement and eye.",
                  "Fill in all applicable fields for both eyes.",
                  "Click Save Record to save your entries, or proceed to the next section.",
                ]}
              />
            </SubSection>
          </Section>

          {/* 10. Anterior Segment */}
          <Section id="anterior-segment" title="10. Anterior Segment">
            <p className="text-sm text-slate-700 mb-3">
              The Clinical Exam (Anterior Segment) section records findings from
              the Slit Lamp Examination — a clinical assessment of the
              structures at the front of both eyes.
            </p>
            <SubSection title="10.1 Slit Lamp Examination Fields">
              <p className="text-sm text-slate-700 mb-3">
                All fields are recorded separately for the right eye (OD) and
                the left eye (OS). Enter clinical findings as free text in each
                field.
              </p>
              <Table
                headers={["Field", "Description"]}
                rows={[
                  [
                    "Cornea OD",
                    "Slit lamp findings for the cornea of the right eye.",
                  ],
                  [
                    "Cornea OS",
                    "Slit lamp findings for the cornea of the left eye.",
                  ],
                  [
                    "Conjunctiva OD",
                    "Slit lamp findings for the conjunctiva of the right eye.",
                  ],
                  [
                    "Conjunctiva OS",
                    "Slit lamp findings for the conjunctiva of the left eye.",
                  ],
                  [
                    "Iris OD",
                    "Slit lamp findings for the iris of the right eye.",
                  ],
                  [
                    "Iris OS",
                    "Slit lamp findings for the iris of the left eye.",
                  ],
                  [
                    "Lens OD",
                    "Slit lamp findings for the lens of the right eye.",
                  ],
                  [
                    "Lens OS",
                    "Slit lamp findings for the lens of the left eye.",
                  ],
                  ["Pupil OD", "Findings for the pupil of the right eye."],
                  ["Pupil OS", "Findings for the pupil of the left eye."],
                ]}
              />
            </SubSection>
            <SubSection title="10.2 How to Use">
              <Steps
                items={[
                  "Click Clinical Exam (Anterior Segment) in the section tab bar.",
                  "Scroll down to view all Slit Lamp Examination fields.",
                  "Click each field and type the clinical findings for that structure and eye.",
                  "Complete all applicable fields for both OD and OS.",
                  "Click Save Record to save your entries, or proceed to the next section.",
                ]}
              />
            </SubSection>
          </Section>

          {/* 11. Special Tests */}
          <Section id="special-tests" title="11. Special Tests — Tonometry">
            <p className="text-sm text-slate-700 mb-3">
              The Special Tests section records Tonometry findings — the
              measurement of Intraocular Pressure (IOP) for both eyes.
            </p>
            <SubSection title="11.1 Tonometry Fields">
              <Table
                headers={["Field", "Description"]}
                rows={[
                  [
                    "Method",
                    "The tonometry method used during the examination (e.g., NCT / Applanation).",
                  ],
                  [
                    "IOP OD (mmHg)",
                    "Intraocular Pressure reading for the Right Eye in mmHg.",
                  ],
                  [
                    "IOP OS (mmHg)",
                    "Intraocular Pressure reading for the Left Eye in mmHg.",
                  ],
                ]}
              />
            </SubSection>
            <SubSection title="11.2 How to Use">
              <Steps
                items={[
                  "Click Special Tests in the section tab bar.",
                  "Click the Method field and enter the tonometry method used.",
                  "Click the IOP OD (mmHg) field and enter the right eye pressure reading.",
                  "Click the IOP OS (mmHg) field and enter the left eye pressure reading.",
                  "Click Save Record to save your entries, or proceed to the next section.",
                ]}
              />
            </SubSection>
          </Section>

          {/* 12. Fundus */}
          <Section id="fundus" title="12. Fundus">
            <p className="text-sm text-slate-700 mb-3">
              The Fundus section provides an interactive drawing canvas for
              documenting posterior segment findings. Separate drawing canvases
              are available for the right eye (OD) and the left eye (OS).
            </p>
            <SubSection title="12.1 Canvas Tools">
              <Table
                headers={["Tool", "Description"]}
                rows={[
                  [
                    "OD Canvas",
                    "A circular drawing area for the right eye fundus findings.",
                  ],
                  [
                    "OS Canvas",
                    "A circular drawing area for the left eye fundus findings.",
                  ],
                  [
                    "Colour Palette",
                    "Colour options displayed below each canvas. Click a colour to select it before drawing.",
                  ],
                  [
                    "Eraser",
                    "Click to switch to eraser mode to correct drawing errors without clearing the entire canvas.",
                  ],
                  [
                    "Clear / Delete",
                    "Click to completely clear and reset the canvas for that eye.",
                  ],
                ]}
              />
            </SubSection>
            <SubSection title="12.2 How to Use">
              <Steps
                items={[
                  "Click Fundus in the section tab bar.",
                  "Select a colour from the palette below the OD canvas.",
                  "Use your finger (on a touchscreen) or mouse pointer (on desktop) to draw findings directly on the circular canvas.",
                  "Use the Eraser to correct specific marks without clearing the full canvas.",
                  "Use the Clear/Delete button to clear the entire canvas and start again if needed.",
                  "Repeat the same process for the OS canvas below.",
                  "Click Save Record to save your drawings, or proceed to the next section.",
                ]}
              />
            </SubSection>
          </Section>

          {/* 13. Diagnosis */}
          <Section id="diagnosis" title="13. Diagnosis & Management">
            <p className="text-sm text-slate-700 mb-3">
              The Diagnosis & Management section is the final section of the
              clinical examination. It records the clinician's concluding
              assessment and the management plan for the patient.
            </p>
            <SubSection title="13.1 Fields">
              <Table
                headers={["Field", "Description"]}
                rows={[
                  [
                    "Final Diagnosis",
                    "The clinician's final clinical diagnosis for this visit. Multiple diagnoses may be entered.",
                  ],
                  [
                    "Plan / Management",
                    "The proposed treatment and follow-up plan for the patient, which may include prescription of glasses, medications, referral, or other instructions.",
                  ],
                ]}
              />
            </SubSection>
            <SubSection title="13.2 How to Use">
              <Steps
                items={[
                  "Click Diagnosis in the section tab bar.",
                  "Click the Final Diagnosis field and enter the clinical diagnosis.",
                  "Click the Plan / Management field and enter the full treatment and follow-up plan.",
                  "Once all sections of the examination are complete, click the Save Record button to finalise and save the entire examination record.",
                ]}
              />
            </SubSection>
          </Section>

          {/* 14. Save Record */}
          <Section id="save-record" title="14. Save Record">
            <p className="text-sm text-slate-700 mb-3">
              The Save Record button is available at the top right of the New
              Clinical Examination screen at all times. It saves all data
              entered across every section as a single examination record for
              the patient.
            </p>
            <SubSection title="14.1 How to Save">
              <Steps
                items={[
                  "At any point during the examination, click the blue Save Record button in the top-right corner of the screen.",
                  "All data entered across all sections is saved together as one clinical visit record.",
                  "The saved record appears in the patient's Clinical History on their Patient Profile.",
                ]}
              />
            </SubSection>
            <SubSection title="14.2 Viewing and Editing a Saved Record">
              <Steps
                items={[
                  "Open the Patient Profile from the Patient Dashboard.",
                  "Scroll to the Clinical History section.",
                  "All saved examinations are listed chronologically. Click any entry to open and review the full record.",
                  "To edit a saved record, open it, make changes across the relevant sections, and click Save Record again.",
                ]}
              />
              <Notice type="important">
                Always click Save Record before closing the browser, navigating
                away, or switching apps. Unsaved data will be lost if you leave
                the examination screen without saving.
              </Notice>
            </SubSection>
          </Section>

          {/* 15. Troubleshooting */}
          <Section id="troubleshooting" title="15. Troubleshooting">
            <SubSection title="15.1 Common Issues and Solutions">
              <Table
                headers={["Issue", "Solution"]}
                rows={[
                  [
                    "App not loading",
                    "Check your internet connection. Refresh the page (F5 or Ctrl+R). Try a different browser. Clear your browser cache (Ctrl+Shift+Delete on Windows / Cmd+Shift+Delete on Mac).",
                  ],
                  [
                    "Login not working",
                    "Ensure JavaScript is enabled. Try a different browser. If using Internet Identity for the first time, ensure you have created an anchor and registered a device.",
                  ],
                  [
                    "Patient not found in search",
                    "Check the spelling of the name. Try searching by phone number instead. If the patient is not registered, use the New Patient button to register them.",
                  ],
                  [
                    "Data not saving",
                    "Ensure your internet connection is active. Click Save Record before navigating away from the New Clinical Examination screen.",
                  ],
                  [
                    "Fundus canvas not responding",
                    "On mobile, use your fingertip directly on the canvas. On desktop, click and drag with the mouse. Ensure you are using a supported browser.",
                  ],
                  [
                    "Section tabs not all visible",
                    "Scroll the tab bar horizontally to reveal additional sections.",
                  ],
                  [
                    "Page layout appears broken",
                    "Set browser zoom to 100% (Ctrl+0 on Windows / Cmd+0 on Mac). Refresh the page and try again.",
                  ],
                  [
                    "Stats not updating",
                    "Refresh the Patient Dashboard after saving examination records. The counters update on page reload.",
                  ],
                ]}
              />
            </SubSection>
            <SubSection title="15.2 Clearing Browser Cache">
              <Steps
                items={[
                  "In Google Chrome: Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac).",
                  "Select Cached images and files and Cookies and other site data.",
                  "Click Clear Data.",
                  "Reload Eye Clinic Manager and continue working.",
                ]}
              />
            </SubSection>
          </Section>

          {/* 16. FAQ */}
          <Section id="faq" title="16. Frequently Asked Questions">
            {[
              {
                q: "Can multiple patients be registered and examined on the same day?",
                a: "Yes. Eye Clinic Manager supports an unlimited number of patient registrations and examinations. The Visits Today counter on the Patient Dashboard reflects all visits recorded for the current date.",
              },
              {
                q: "Can I go back and edit a saved examination record?",
                a: "Yes. Open the Patient Profile, click the relevant entry in the Clinical History section, make changes across the required sections, and click Save Record again to update.",
              },
              {
                q: "Is my patient data private?",
                a: "Yes. Eye Clinic Manager uses ICP Internet Identity — a cryptographically secure authentication system. Your patient data is strictly isolated to your authenticated identity. No other user can access your records.",
              },
              {
                q: "Can I use Eye Clinic Manager on a tablet or mobile device?",
                a: "Yes. Eye Clinic Manager is accessible from any modern web browser on a smartphone, tablet, or desktop computer. The interface is optimised for desktop use; on smaller screens, some layout adjustments may apply.",
              },
              {
                q: "What happens if I close the browser during an examination?",
                a: "Any data not saved using the Save Record button will be lost. Always click Save Record before closing the browser, switching applications, or navigating away from the examination screen.",
              },
              {
                q: "How do I log out?",
                a: "Click the Log Out button at the bottom of the sidebar. This securely ends your session. No patient data remains accessible until you log in again.",
              },
              {
                q: "Can I delete a patient record?",
                a: "Patient deletion may be available via the Actions column on the Patient Dashboard. Contact your system administrator if this option is not visible.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="mb-4">
                <p className="text-sm font-semibold text-slate-800 mb-1">{q}</p>
                <p className="text-sm text-slate-600">{a}</p>
              </div>
            ))}
          </Section>

          {/* 17. Glossary */}
          <Section id="glossary" title="17. Glossary">
            <Table
              headers={["Term", "Definition"]}
              rows={[
                [
                  "OD (Oculus Dexter)",
                  "Medical abbreviation for the right eye.",
                ],
                [
                  "OS (Oculus Sinister)",
                  "Medical abbreviation for the left eye.",
                ],
                [
                  "VA (Visual Acuity)",
                  "A measure of the sharpness of vision, typically recorded as a fraction (e.g., 6/6, 6/12).",
                ],
                [
                  "IOP (Intraocular Pressure)",
                  "The fluid pressure inside the eye, measured in millimetres of mercury (mmHg). Normal range is typically 10–21 mmHg.",
                ],
                [
                  "Tonometry",
                  "A clinical procedure used to measure intraocular pressure.",
                ],
                [
                  "NCT (Non-Contact Tonometry)",
                  "A method of tonometry that measures IOP using a puff of air, without touching the eye.",
                ],
                [
                  "Applanation Tonometry",
                  "A contact method of measuring IOP considered the gold standard in clinical practice.",
                ],
                [
                  "Slit Lamp",
                  "A binocular microscope used to examine the anterior segment of the eye under high magnification.",
                ],
                [
                  "Anterior Segment",
                  "The front portion of the eye, including the cornea, conjunctiva, iris, lens, and pupil.",
                ],
                [
                  "Posterior Segment / Fundus",
                  "The back portion of the eye, including the retina, optic disc, macula, and blood vessels.",
                ],
                [
                  "CO (Chief Complaint)",
                  "The patient's primary reason for attending the clinical examination, stated in their own words.",
                ],
                [
                  "Internet Identity",
                  "A cryptographically secure, passwordless authentication system provided by the Internet Computer Protocol (ICP).",
                ],
                [
                  "ICP (Internet Computer Protocol)",
                  "A decentralised computing platform that hosts the Eye Clinic Manager application and its data.",
                ],
                [
                  "Principal",
                  "A unique cryptographic identifier assigned to each Internet Identity user, used to isolate patient data per clinician.",
                ],
              ]}
            />
          </Section>

          {/* 18. Copyright */}
          <Section id="copyright" title="18. Copyright & Disclaimer">
            <p className="text-sm text-slate-700 mb-3">
              <strong>Eye Clinic Manager</strong> is a proprietary clinical
              management application. All rights reserved.
            </p>
            <p className="text-sm text-slate-700 mb-3">
              This user manual is provided for informational and training
              purposes only. The content of this manual is subject to change
              without notice as the application is updated.
            </p>
            <Notice type="important">
              Eye Clinic Manager is a clinical record-keeping tool intended
              solely for use by licensed optometrists and qualified eye care
              professionals. The system does not provide automated clinical
              advice, diagnostic suggestions, or treatment recommendations. All
              clinical decisions, diagnoses, and management plans remain the
              sole professional and legal responsibility of the examining
              clinician.
            </Notice>
            <p className="text-sm text-slate-700 mb-3">
              The developers and operators of Eye Clinic Manager accept no
              liability for clinical errors, misuse of the system, data loss
              resulting from unsaved records, or decisions made on the basis of
              information recorded within the application.
            </p>
            <p className="text-sm text-slate-700">
              By using Eye Clinic Manager, you agree to these terms and confirm
              that you are a licensed eye care professional using the system in
              accordance with your professional obligations.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 mt-8 pb-8">
          Eye Clinic Manager — User Manual | Clinical Eye Care Management System
        </div>
      </div>
    </div>
  );
}
