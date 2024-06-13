<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ForeignInstitutesRegistrySeeder extends Seeder
{
    public function run()
    {
        // Define the path to the CSV files within the resources directory
        $csvFolderPath = resource_path('js/csv');

        // Parse and insert data from 'foreign_recognized_institutes_registry.csv' with colon delimiter
        // Institutes from this file are franchise
        $this->parseAndInsertInstitutes($csvFolderPath . '/foreign_recognized_institutes_registry.csv', ':', false);

        // Parse and insert data from 'foreign_degree_franchise.csv' with semicolon delimiter
        // Institutes from this file are not franchise
        $this->parseAndInsertInstitutes($csvFolderPath . '/foreign_degree_franchise.csv', ';', true);
    }

    private function parseAndInsertInstitutes($filePath, $delimiter, $franchise)
    {
        if (file_exists($filePath)) {
            if (($handle = fopen($filePath, 'r')) !== false) {
                // Skip the header row
                fgetcsv($handle, 1000, $delimiter);

                while (($data = fgetcsv($handle, 1000, $delimiter)) !== false) {
                    // Trim the data to remove any extra whitespace
                    $countryName = trim($data[0]);
                    $instituteName = trim($data[1]);
                    $info = isset($data[2]) ? trim($data[2]) : null;
                    // For 'foreign_degree_franchise.csv', the country is in the second column
                    if ($delimiter == ';') {
                        $countryName = trim($data[1]);
                        $instituteName = trim($data[0]);
                        $info = isset($data[2]) ? trim($data[2]) : null;
                    }

                    // Find the country_id from the countries table
                    $countryId = DB::table('countries')->where('country', $countryName)->value('id');

                    // If the country was found, insert the institute into the foreign_institutes_registry table
                    if ($countryId) {
                        DB::table('foreign_institutes_registry')->insert([
                            'country_id' => $countryId,
                            'institute' => $instituteName,
                            // Assuming 'info' is available in the CSV or set default values
                            'info' => $info, // Set this to the actual info if available
                            'franchise' => $franchise, // Set based on the CSV file
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]);
                    }
                }
                fclose($handle);
            }
        }
    }
}
