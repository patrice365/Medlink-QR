<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\Visit;
use Illuminate\Database\Seeder;

/**
 * Loads the made-up demo patients and visits from the Magic Patterns design
 * (database/seeders/data/*.json, exported from resources/js/data/).
 * For development only. Do not run this on the real clinic database.
 */
class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->load('sample-patients.json') as $record) {
            $patient = Patient::findOrNew($record->id);
            $patient->id = $record->id;
            $patient->clinic_no = $record->clinicNo;
            $patient->registered_at = $record->registeredAt;
            $patient->fillFromRecord($record)->save();
        }

        foreach ($this->load('sample-visits.json') as $record) {
            $visit = Visit::findOrNew($record->id);
            $visit->id = $record->id;
            $visit->patient_id = $record->patientId;
            $visit->submitted_at = $record->submittedAt;
            $visit->status = $record->status;
            $visit->amended_at = $record->amendedAt ?? null;
            $visit->amended_by = $record->amendedBy ?? null;
            $visit->fillClinical($record->clinical)->save();
        }
    }

    private function load(string $file): array
    {
        return json_decode(file_get_contents(__DIR__.'/data/'.$file));
    }
}
