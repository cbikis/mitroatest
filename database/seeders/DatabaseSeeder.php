<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UsersSeeder::class);
        $this->call(AdminSeeder::class);
        $this->call(CountriesSeeder::class);
        $this->call(ForeignInstitutesRegistrySeeder::class);
        $this->call(ForeignRecognizedAcademicTitlesSeeder::class);
        // You can uncomment the below lines if you want to run User factories as well
        // \App\Models\User::factory(10)->create();
        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
