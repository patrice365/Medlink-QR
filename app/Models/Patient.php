<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use stdClass;

/**
 * A registered patient. The full record lives in the `data` column as JSON,
 * in the same camelCase shape as the frontend's PatientRecord type.
 */
class Patient extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'clinic_no', 'registered_at', 'surname', 'first_name', 'middle_name',
        'date_of_birth', 'student_no', 'program', 'data',
    ];

    public function visits(): HasMany
    {
        return $this->hasMany(Visit::class);
    }

    /** Copies the record into the `data` column and the searchable columns. */
    public function fillFromRecord(stdClass $record): static
    {
        // These are set by the server, not by the client.
        unset($record->id, $record->clinicNo, $record->registeredAt);

        $this->surname = trim((string) ($record->surname ?? ''));
        $this->first_name = trim((string) ($record->firstName ?? ''));
        $this->middle_name = trim((string) ($record->middleName ?? '')) ?: null;
        $this->date_of_birth = ($record->dateOfBirth ?? '') ?: null;
        $this->student_no = trim((string) ($record->studentNo ?? '')) ?: null;
        $this->program = trim((string) ($record->program ?? '')) ?: null;
        $this->data = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return $this;
    }

    /** The full PatientRecord object for the frontend. */
    public function toRecord(): stdClass
    {
        $record = json_decode($this->data ?: '{}') ?: new stdClass;
        $record->id = $this->id;
        $record->clinicNo = $this->clinic_no;
        $record->registeredAt = $this->registered_at;

        return $record;
    }

    /** The small subset that anyone scanning the QR code can see. */
    public function toPublicRecord(): array
    {
        return [
            'id' => $this->id,
            'clinicNo' => $this->clinic_no,
            'surname' => $this->surname,
            'firstName' => $this->first_name,
            'middleName' => $this->middle_name ?? '',
            'dateOfBirth' => $this->date_of_birth ?? '',
            'program' => $this->program ?? '',
        ];
    }

    /** A new record ID like "ML-24F0J1" that is not already taken. */
    public static function newId(): string
    {
        do {
            $id = 'ML-'.Str::upper(Str::random(6));
        } while (static::whereKey($id)->exists());

        return $id;
    }

    /** The next clinic number for this year, e.g. "2026-0101". */
    public static function nextClinicNo(): string
    {
        $year = now()->year;
        $last = static::where('clinic_no', 'like', "$year-%")->orderByDesc('clinic_no')->value('clinic_no');
        $next = $last ? ((int) substr($last, 5)) + 1 : 101;

        return sprintf('%d-%04d', $year, $next);
    }
}
