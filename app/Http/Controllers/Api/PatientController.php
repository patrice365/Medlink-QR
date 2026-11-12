<?php

namespace App\Http\Controllers\Api;

use App\Models\Patient;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use stdClass;

class PatientController extends ApiController
{
    /** GET /api/patients  (staff)  →  all records, newest first */
    public function index(): JsonResponse
    {
        $records = Patient::orderByDesc('registered_at')->get()->map->toRecord();

        return response()->json($records);
    }

    /** GET /api/patients/{id}  (staff) */
    public function show(string $id): JsonResponse
    {
        return response()->json($this->find($id)->toRecord());
    }

    /** GET /api/public/patients/{id}  (anyone)  →  only what the QR page shows */
    public function publicShow(string $id): JsonResponse
    {
        return response()->json($this->find($id)->toPublicRecord());
    }

    /** POST /api/patients  (anyone)  →  registers a patient, 201 */
    public function store(Request $request): JsonResponse
    {
        $record = $this->validRecord($request);

        // Two registrations at the same moment could pick the same clinic number.
        // The unique index catches that; try again with the next number.
        for ($attempt = 1; ; $attempt++) {
            try {
                $patient = new Patient;
                $patient->id = Patient::newId();
                $patient->clinic_no = Patient::nextClinicNo();
                $patient->registered_at = now()->toIso8601String();
                $patient->fillFromRecord(clone $record)->save();
                break;
            } catch (UniqueConstraintViolationException $e) {
                if ($attempt >= 3) {
                    throw $e;
                }
            }
        }

        return response()->json($patient->toRecord(), 201);
    }

    /** PUT /api/patients/{id}  (staff)  body: the full PatientRecord */
    public function update(Request $request, string $id): JsonResponse
    {
        $patient = $this->find($id);
        $patient->fillFromRecord($this->validRecord($request))->save();

        return response()->json($patient->toRecord());
    }

    private function find(string $id): Patient
    {
        return Patient::findOrFail(strtoupper(trim($id)));
    }

    /** Basic server-side checks. The detailed form checks run in the browser (utils/validation.ts). */
    private function validRecord(Request $request): stdClass
    {
        $record = $this->jsonBody($request);

        $request->validate([
            'surname' => ['required', 'string', 'max:100'],
            'firstName' => ['required', 'string', 'max:100'],
            'middleName' => ['nullable', 'string', 'max:100'],
            'dateOfBirth' => ['nullable', 'date_format:Y-m-d', 'before_or_equal:today'],
            'studentNo' => ['nullable', 'string', 'max:50'],
            'program' => ['nullable', 'string', 'max:100'],
            'email' => ['nullable', 'string', 'max:150'],
            // Photos and signatures arrive as base64 data URLs; keep each under ~2 MB.
            'photo' => ['nullable', 'string', 'max:2800000'],
            'consentSignature' => ['nullable', 'string', 'max:2800000'],
        ]);

        foreach (['photo', 'consentSignature'] as $key) {
            $value = $record->{$key} ?? '';
            if ($value !== '' && ! str_starts_with($value, 'data:image/')) {
                throw ValidationException::withMessages([$key => "The $key must be an image."]);
            }
        }

        $this->objectField($record, 'clinical');

        return $record;
    }
}
