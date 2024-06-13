<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ForeignRecognizedAcademicTitlesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Define the path to the CSV file
        $csvFilePath = resource_path('js/csv/foreign_recognized_academic_titles.csv'); // Replace 'your-csv-file.csv' with the actual CSV filename

        // Read the CSV file
        if (($handle = fopen($csvFilePath, 'r')) !== false) {
            // Skip the header row
            fgetcsv($handle);

            while (($row = fgetcsv($handle, 1000, ";")) !== false) {
                // Retrieve the country ID from the 'countries' table
                $countryName = trim($row[0]);
                $countryId = DB::table('countries')->where('country', $countryName)->value('id');

                // Only proceed if the country exists in the 'countries' table
                if ($countryId) {
                    DB::table('foreign_recognized_academic_titles')->insert([
                        'country_id' => $countryId,
                        'title' => trim($row[1]),
                        'title_type' => trim($row[2]),
                        'info' => trim($row[3]),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            fclose($handle);
        }
    }
}
