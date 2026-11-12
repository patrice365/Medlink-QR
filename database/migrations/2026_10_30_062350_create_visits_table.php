<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visits', function (Blueprint $table) {
            // Visit ID, e.g. "VS-L8K2QZ".
            $table->string('id', 20)->primary();
            $table->string('patient_id', 20);
            $table->foreign('patient_id')->references('id')->on('patients')->cascadeOnDelete();
            $table->string('submitted_at', 40);
            $table->enum('status', ['Completed', 'Follow-up Required', 'Archived'])->index();
            $table->string('visit_at', 40)->nullable()->index();
            $table->string('physician')->nullable();
            $table->string('amended_at', 40)->nullable();
            $table->string('amended_by')->nullable();

            // The ClinicalRecord as the frontend sends it (camelCase JSON).
            $table->longText('clinical');
            $table->timestamps();

            $table->index('patient_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
