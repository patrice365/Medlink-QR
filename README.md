# MedLink-QR

MedLink-QR is a student health record system for the Leyte Normal University (LNU) Health Services Office. A student fills out their health record once online and gets a personal **QR code**. When they come to the clinic, or in an emergency, staff scan the code to open the record right away. Staff can then log the visit, and the system gives them a **triage summary** that shows how urgent the case is.

The app is a **Laravel 12** backend (REST API with Sanctum tokens) plus a **React 18 + TypeScript** single-page frontend built with Vite and Tailwind CSS.

---

## What is included

### Backend (Laravel)

| Area | Files | What it does |
|---|---|---|
| API routes | [routes/api.php](routes/api.php) | Public endpoints (register, login, QR lookup) and staff-only endpoints protected by `auth:sanctum`. Rate limits are applied to the public ones. |
| Web route | [routes/web.php](routes/web.php) | Sends every non-`/api` URL to the React app ([resources/views/app.blade.php](resources/views/app.blade.php)). |
| Controllers | [app/Http/Controllers/Api/](app/Http/Controllers/Api/) | `AuthController` (PIN login/logout), `PatientController` (register, list, view, update, public QR view), `VisitController` (list, add, and amend visits; amending is physician-only). |
| Models | [app/Models/](app/Models/) | `Patient` (generates record IDs like `ML-24F0J1` and yearly clinic numbers like `2026-0101`), `Visit` (status is set from the follow-up date), `Staff` (PIN-based accounts with `staff` or `physician` level). |
| Migrations | [database/migrations/](database/migrations/) | Tables: `staff`, `patients`, `visits`, `personal_access_tokens`. Full patient and clinical records are stored as JSON, with key fields copied into columns for searching and sorting. |
| Seeders | [database/seeders/](database/seeders/) | `StaffSeeder` creates two demo accounts. `SampleDataSeeder` loads 6 sample patients and 17 visits from [database/seeders/data/](database/seeders/data/) (skipped in production). |

### Frontend (React + TypeScript)

| Area | Files | What it does |
|---|---|---|
| Entry and routing | [resources/js/main.tsx](resources/js/main.tsx), [resources/js/App.tsx](resources/js/App.tsx) | Mounts the app and defines the pages below. |
| Pages | [resources/js/pages/](resources/js/pages/) | `Home`, `Register`, `ScanView`, `StaffLogin`, `ClinicRecords`, `RecordDetail`, `TriageDashboard`. |
| Registration form | [resources/js/components/patient-form/](resources/js/components/patient-form/), [resources/js/components/forms/](resources/js/components/forms/) | A 5-step form: Student Information, School & Contact, Health History, Lifestyle, Review & Submit. Includes photo and guardian-signature upload. Drafts autosave to the browser. |
| QR features | `QrModal.tsx`, `QrScannerModal.tsx` | Shows the student's QR code (`qrcode.react`) and scans codes with the device camera (`html5-qrcode`). |
| Visit history | [resources/js/components/visit-history/](resources/js/components/visit-history/) | Table and timeline views of a patient's visits, with filters, pagination, and a detail panel. |
| Triage logic | [resources/js/utils/triage.ts](resources/js/utils/triage.ts) | Scores vital signs (temperature, heart rate, breathing rate, blood pressure), chief-complaint keywords, and risky history (asthma, epilepsy, diabetes, hypertension) to rate a case as **Emergent**, **Urgent**, **Non-urgent**, or **Pending**, with a recommendation. |
| API client and state | [resources/js/lib/api.ts](resources/js/lib/api.ts), [resources/js/contexts/RecordsContext.tsx](resources/js/contexts/RecordsContext.tsx) | Calls the Laravel API with the bearer token (kept in `sessionStorage`) and shares records across pages. |
| Types and helpers | [resources/js/types/](resources/js/types/), [resources/js/utils/](resources/js/utils/), [resources/js/data/](resources/js/data/) | Shared types, validation, form options, and landing-page content. |
| Styling | [tailwind.config.js](tailwind.config.js), [resources/css/app.css](resources/css/app.css) | Tailwind CSS v3 theme with LNU brand colors. |

### API endpoints

| Method | Endpoint | Who can use it | Purpose |
|---|---|---|---|
| POST | `/api/login` | Anyone | Sign in with a PIN; returns a token valid for 12 hours |
| POST | `/api/patients` | Anyone | Register a new student health record |
| GET | `/api/public/patients/{id}` | Anyone | Basic info shown when a QR code is scanned (name, clinic no., birth date, program only) |
| POST | `/api/logout` | Staff | Revoke the current token |
| GET | `/api/patients` | Staff | List all records, newest first |
| GET / PUT | `/api/patients/{id}` | Staff | View or update a full record |
| GET | `/api/visits` | Staff | List visits |
| POST | `/api/patients/{patientId}/visits` | Staff | Add a clinic visit |
| PUT | `/api/visits/{id}` | Physician only | Amend a submitted visit |

---

## How to run it

**Requirements:** PHP 8.2+, Composer, Node.js 20+, npm. The default database is SQLite.

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

# Creates database/database.sqlite if needed, builds tables, and loads demo data
php artisan migrate --seed

# Run the Laravel server and the Vite dev server (two terminals)
php artisan serve
npm run dev
```

Open http://127.0.0.1:8000.

For a production build, run `npm run build` instead of `npm run dev`. To check the TypeScript code, run `npm run typecheck`.

### Demo accounts

| Role | PIN |
|---|---|
| Clinic staff | `1234` |
| Head physician | `4321` |

These are for testing only. Change them in [database/seeders/StaffSeeder.php](database/seeders/StaffSeeder.php) before the system holds real patient data.

---

## What you should see

1. **Home page (`/`)**: the LNU Health Services landing page explaining the three steps (fill out your record, add a guardian signature, get your QR code), with buttons to register or sign in as staff.
2. **Registration (`/register`)**: the 5-step form with a progress bar. After submitting, the student gets a record ID (e.g. `ML-24F0J1`), a clinic number (e.g. `2026-0101`), and a **QR code** to save or screenshot.
3. **QR scan page (`/p/{id}`)**: scanning a student's QR code opens this page. Anyone can see the basic details; full medical information stays hidden until a staff member signs in.
4. **Staff login (`/login`)**: enter a PIN. A wrong PIN shows *"That PIN is not correct"*.
5. **Clinic records (`/clinic`)**: a searchable list of all registered students (the 6 sample patients after seeding), plus a camera QR scanner to find a record quickly.
6. **Record detail (`/clinic/records/{id}`)**: the student's full health record and visit history (table or timeline). Staff can add a visit with chief complaint, vital signs, and the examining physician. A visit with a follow-up date is marked **Follow-up Required**; otherwise it is **Completed**. Only the physician account can amend a past visit.
7. **Triage dashboard (`/clinic/triage`)**: each patient's latest visit rated **Emergent**, **Urgent**, **Non-urgent**, or **Pending**, with the warning signs found (for example "High fever 39.8°C" or "Very fast heart rate") and what to do next, such as *"See within 30 minutes. Re-check vital signs every 15 minutes."*

---

## Project structure

```
app/
  Http/Controllers/Api/   API controllers (auth, patients, visits)
  Models/                 Patient, Visit, Staff
database/
  migrations/             Table definitions
  seeders/                Demo staff accounts and sample data (JSON)
resources/
  js/                     React + TypeScript frontend
  css/app.css             Tailwind entry
  views/app.blade.php     HTML shell for the React app
routes/
  api.php                 REST API
  web.php                 Sends all other URLs to React
public/                   Logo and images
```
