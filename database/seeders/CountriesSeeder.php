<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // Import Carbon for handling dates

class CountriesSeeder extends Seeder
{
    public function run()
    {
        // Define the path to the CSV files within the resources directory
        $csvFolderPath = resource_path('js/csv');

        // An array to hold all countries from all CSV files
        $allCountries = [];

        // Parse 'foreign_recognized_academic_titles.csv' and 'foreign_degree_franchise.csv' with semicolon delimiter
        $allCountries = array_merge($allCountries, $this->parseCsv($csvFolderPath . '/foreign_recognized_academic_titles.csv', ';', 0));
        $allCountries = array_merge($allCountries, $this->parseCsv($csvFolderPath . '/foreign_degree_franchise.csv', ';', 1));

        // Parse 'foreign_recognized_institutes_registry.csv' with colon delimiter
        $allCountries = array_merge($allCountries, $this->parseCsvWithColon($csvFolderPath . '/foreign_recognized_institutes_registry.csv'));

        // Remove duplicates
        $uniqueCountries = array_unique($allCountries);

        $timestamp = Carbon::now();

        // Insert unique countries into the database
        foreach ($uniqueCountries as $countryName) {
            // Check if the country already exists in the database to prevent duplicates
            $countryExists = DB::table('countries')->where('country', $countryName)->exists();
            if (!$countryExists) {
                DB::table('countries')->insert([
                    'country' => $countryName,
                    'created_at' => $timestamp, // Set the current timestamp for created_at
                    'updated_at' => $timestamp  // Set the current timestamp for updated_at
                ]);
            }
        }
    }

    private function parseCsv($filePath, $delimiter, $countryIndex)
    {
        $countries = [];
        $lineNumber = 0;

        if (file_exists($filePath)) {
            if (($handle = fopen($filePath, 'r')) !== false) {
                while (($data = fgetcsv($handle, 1000, $delimiter)) !== false) {
                    // Skip the header row
                    if ($lineNumber == 0) {
                        $lineNumber++;
                        continue;
                    }
                    $countries[] = trim($data[$countryIndex]);
                    $lineNumber++;
                }
                fclose($handle);
            }
        }

        return $countries;
    }

    private function parseCsvWithColon($filePath)
    {
        $countries = [];
        $lineNumber = 0;

        if (file_exists($filePath)) {
            if (($handle = fopen($filePath, 'r')) !== false) {
                while (($line = fgets($handle)) !== false) {
                    // Skip the header row
                    if ($lineNumber == 0) {
                        $lineNumber++;
                        continue;
                    }
                    $parts = explode(':', $line);
                    if (count($parts) > 1) {
                        $countries[] = trim($parts[0]);
                    }
                    $lineNumber++;
                }
                fclose($handle);
            }
        }

        return $countries;
    }
}
