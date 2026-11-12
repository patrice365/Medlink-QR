<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use stdClass;

abstract class ApiController extends Controller
{
    /**
     * Reads the JSON body as objects instead of PHP arrays.
     * PHP arrays turn empty objects like `"pastHistory": {}` into `[]`,
     * which would change the record's shape for the frontend.
     */
    protected function jsonBody(Request $request): stdClass
    {
        $body = json_decode($request->getContent());
        if (! $body instanceof stdClass) {
            throw ValidationException::withMessages(['body' => 'The request body must be a JSON object.']);
        }

        return $body;
    }

    /** Reads `key` from the body and checks it is a JSON object. */
    protected function objectField(stdClass $body, string $key): stdClass
    {
        $value = $body->{$key} ?? null;
        if (! $value instanceof stdClass) {
            throw ValidationException::withMessages([$key => "The $key field must be an object."]);
        }

        return $value;
    }
}
