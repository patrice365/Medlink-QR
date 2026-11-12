<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            // Public record ID shown in the QR code, e.g. "ML-24F0J1".
            $table->string('id', 20)->primary();
            $table->string('clinic_no', 20)->unique();
            $table->string('registered_at', 40);

            // Copies of a few fields so the database can search and sort on them.
            $table->string('surname')->index();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('date_of_birth', 10)->nullable();
            $table->string('student_no')->nullable()->index();
            $table->string('program')->nullable();

            // The full PatientRecord as the frontend sends it (camelCase JSON).
            $table->longText('data');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
