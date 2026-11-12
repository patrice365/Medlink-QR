<?php

namespace App\Http\Controllers\Api;

use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends ApiController
{
    /** POST /api/login  body {pin}  →  {token, session} */
    public function login(Request $request): JsonResponse
    {
        $request->validate(['pin' => ['required', 'string', 'max:20']]);
        $pin = trim($request->string('pin'));

        $staff = Staff::all()->first(fn (Staff $s) => Hash::check($pin, $s->pin));
        if (! $staff) {
            return response()->json(['message' => 'That PIN is not correct'], 401);
        }

        $token = $staff->createToken('clinic', ['*'], now()->addHours(12))->plainTextToken;

        return response()->json([
            'token' => $token,
            'session' => ['role' => 'clinic', 'level' => $staff->level, 'name' => $staff->name],
        ]);
    }

    /** POST /api/logout  →  revokes the token used for this request */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Signed out']);
    }
}
