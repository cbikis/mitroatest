<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Check if an admin user already exists to avoid duplicate entries
        if (User::where('email', 'admin@example.com')->doesntExist()) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@example.com', // Replace with the admin's email address
                'email_verified_at' => now(), // Set email verification date to now
                'password' => Hash::make('#Y%vignaz!6%S7^ZRX'), // Hash the password
                // Add any additional fields that your User model requires
            ]);
        }
    }
}
