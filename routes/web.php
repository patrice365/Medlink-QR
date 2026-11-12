<?php

use Illuminate\Support\Facades\Route;

// Every non-API URL loads the React app; React Router picks the page.
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api/).*$');
