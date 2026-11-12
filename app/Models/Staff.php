<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

/**
 * A clinic account that signs in with a PIN.
 * level is 'staff' or 'physician'; only physicians can amend visits.
 */
class Staff extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'staff';

    protected $fillable = ['name', 'level', 'pin'];

    protected $hidden = ['pin'];

    public function isPhysician(): bool
    {
        return $this->level === 'physician';
    }
}
