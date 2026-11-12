<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use stdClass;

/**
 * A submitted clinic visit. The clinical notes live in the `clinical` column
 * as JSON, in the same camelCase shape as the frontend's ClinicalRecord type.
 */
class Visit extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'patient_id', 'submitted_at', 'status', 'visit_at', 'physician',
        'amended_at', 'amended_by', 'clinical',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function fillClinical(stdClass $clinical): static
    {
        $this->visit_at = ($clinical->dateTime ?? '') ?: null;
        $this->physician = trim((string) ($clinical->physician ?? '')) ?: null;
        $this->clinical = json_encode($clinical, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return $this;
    }

    /** Same rule as statusForSubmission() in resources/js/utils/visit.ts. */
    public static function statusFor(stdClass $clinical): string
    {
        return ! empty($clinical->followUpDate) ? 'Follow-up Required' : 'Completed';
    }

    /** The VisitRecord object for the frontend. */
    public function toRecord(): array
    {
        $record = [
            'id' => $this->id,
            'patientId' => $this->patient_id,
            'submittedAt' => $this->submitted_at,
            'status' => $this->status,
            'clinical' => json_decode($this->clinical ?: '{}') ?: new stdClass,
        ];
        if ($this->amended_at) {
            $record['amendedAt'] = $this->amended_at;
            $record['amendedBy'] = $this->amended_by;
        }

        return $record;
    }

    /** A new visit ID like "VS-L8K2QZ" that is not already taken. */
    public static function newId(): string
    {
        do {
            $id = 'VS-'.Str::upper(Str::random(6));
        } while (static::whereKey($id)->exists());

        return $id;
    }
}
