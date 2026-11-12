<?php

namespace App\Http\Controllers\Api;

use App\Models\Patient;
use App\Models\Visit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VisitController extends ApiController
{
    /** GET /api/visits  (staff)  →  all visits, newest first */
    public function index(): JsonResponse
    {
        $visits = Visit::orderByDesc('submitted_at')->get()->map->toRecord();

        return response()->json($visits);
    }

    /** POST /api/patients/{patientId}/visits  (staff)  body {clinical}  →  201 */
    public function storeForPatient(Request $request, string $patientId): JsonResponse
    {
        $patient = Patient::findOrFail(strtoupper(trim($patientId)));
        $clinical = $this->objectField($this->jsonBody($request), 'clinical');

        $visit = new Visit;
        $visit->id = Visit::newId();
        $visit->patient_id = $patient->id;
        $visit->submitted_at = now()->toIso8601String();
        $visit->status = Visit::statusFor($clinical);
        $visit->fillClinical($clinical)->save();

        return response()->json($visit->toRecord(), 201);
    }

    /** PUT /api/visits/{id}  (physician only)  body {clinical, status} */
    public function update(Request $request, string $id): JsonResponse
    {
        $staff = $request->user();
        if (! $staff->isPhysician()) {
            return response()->json(['message' => 'Only the physician can amend visits'], 403);
        }

        $visit = Visit::findOrFail($id);
        $request->validate([
            'status' => ['required', Rule::in(['Completed', 'Follow-up Required', 'Archived'])],
        ]);
        $clinical = $this->objectField($this->jsonBody($request), 'clinical');

        $visit->status = $request->string('status');
        $visit->amended_at = now()->toIso8601String();
        $visit->amended_by = $staff->name;
        $visit->fillClinical($clinical)->save();

        return response()->json($visit->toRecord());
    }
}
