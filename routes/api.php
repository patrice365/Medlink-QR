<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\VisitController;
use Illuminate\Support\Facades\Route;

// Public: anyone can call these.
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::post('/patients', [PatientController::class, 'store'])->middleware('throttle:20,1');
Route::get('/public/patients/{id}', [PatientController::class, 'publicShow'])->middleware('throttle:60,1');

// Clinic staff only: requires the bearer token from /login.
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::put('/patients/{id}', [PatientController::class, 'update']);

    Route::get('/visits', [VisitController::class, 'index']);
    Route::post('/patients/{patientId}/visits', [VisitController::class, 'storeForPatient']);
    Route::put('/visits/{id}', [VisitController::class, 'update']); // physician only
});
