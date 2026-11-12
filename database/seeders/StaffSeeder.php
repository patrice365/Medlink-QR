<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaffSeeder extends Seeder
{
    /**
     * Demo accounts: staff PIN 1234, physician PIN 4321.
     * Change these before the system holds real patient data.
     */
    public function run(): void
    {
        Staff::updateOrCreate(['level' => 'staff'], ['name' => 'Clinic staff', 'pin' => Hash::make('1234')]);
        Staff::updateOrCreate(['level' => 'physician'], ['name' => 'Head physician', 'pin' => Hash::make('4321')]);
    }
}
