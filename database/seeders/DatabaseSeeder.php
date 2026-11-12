<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(StaffSeeder::class);

        // Demo patients and visits only outside production.
        if (! app()->isProduction()) {
            $this->call(SampleDataSeeder::class);
        }
    }
}
