<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ForeignInstituteRegistry;


class ForeignInstituteController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
{
    // Validate the request data
    $validatedData = $request->validate([
        'country_id' => 'required|exists:countries,id',
        'institute' => 'required|string|max:255',
        'institute_original' => 'nullable|string|max:255',
        'institute_el' => 'nullable|string|max:255',
        'institute_old_1' => 'nullable|string|max:255',
        'institute_old_2' => 'nullable|string|max:255',
        'url' => 'nullable|string|url|max:255',
        'info' => 'nullable|string|max:255',
        'franchise' => 'required|boolean',
    ]);

    // Check for existing institute with the same name, country, and franchise status
    $existingInstitute = ForeignInstituteRegistry::where([
        ['country_id', '=', $validatedData['country_id']],
        ['institute', '=', $validatedData['institute']],
        ['franchise', '=', $validatedData['franchise']],
    ])->first();

    if ($existingInstitute) {
        // If an institute already exists with the same details, return an error response
        return response()->json([
            'message' => 'A record with the same details already exists.',
        ], 422); // 422 Unprocessable Entity
    }

    // Create a new foreign institute
    $foreignInstitute = ForeignInstituteRegistry::create($validatedData);

    // Load the country relationship to get the country name
    $foreignInstitute->load('country');

    // Construct a custom response array with the desired order
    $responseData = [
        'id'           => $foreignInstitute->id,
        'country'      => $foreignInstitute->country->country, // Assuming 'country' is the name attribute in the Country model
        'country_id'   => $foreignInstitute->country_id, // needed in order to be mapped in the UI and send it to the edit again
        'institute'    => $foreignInstitute->institute,
        'institute_el'    => $foreignInstitute->institute_el,
        'institute_original'    => $foreignInstitute->institute_original,
        'institute_old_1'    => $foreignInstitute->institute_old_1,
        'institute_old_2'    => $foreignInstitute->institute_old_2,
        'url'    => $foreignInstitute->url,
        'info'         => $foreignInstitute->info,
        'franchise'    => $foreignInstitute->franchise,
    ];

    // Return a response with the custom data structure
    return response()->json($responseData, 201);
}



    public function indexByCountry($countryId)
    {
        // Validate that the countryId is an integer
        if (!is_numeric($countryId)) {
            return response()->json(['error' => 'Invalid country ID'], 400);
        }

        // Retrieve all institutes for the given country ID
        $institutes = ForeignInstituteRegistry::where('country_id', $countryId)->get();

        // Return the institutes as a JSON response
        return response()->json($institutes);
    }

    public function index()
    {
        // Join the 'countries' table to include the country name and country ID in the results
        $institutes = ForeignInstituteRegistry::query()
            ->join('countries', 'foreign_institutes_registry.country_id', '=', 'countries.id')
            ->select([
                'foreign_institutes_registry.id',
                'countries.id as country_id', // Alias 'countries.id' column as 'country_id'
                'countries.country as country', // Alias 'country' column as 'country_name'
                'foreign_institutes_registry.institute',
                'foreign_institutes_registry.institute_el',
                'foreign_institutes_registry.institute_original',
                'foreign_institutes_registry.institute_old_1',
                'foreign_institutes_registry.institute_old_2',
                'foreign_institutes_registry.url',
                'foreign_institutes_registry.info',
                'foreign_institutes_registry.franchise'
            ])
            ->orderBy('foreign_institutes_registry.id', 'asc') // Sort by 'id' in ascending order
            ->get(); // Fetch all institutes with sorting

        // Return the institutes as a JSON response
        return response()->json($institutes);
    }

public function update(Request $request, ForeignInstituteRegistry $foreignInstitute)
{
    // Validate the request data
    $validatedData = $request->validate([
        'newCountryId' => 'sometimes|exists:countries,id',
        'newInstitute' => 'sometimes|string|max:255',
        'newInstituteOriginal' => 'nullable|string|max:255',
        'newInstituteEl' => 'nullable|string|max:255',
        'newInstituteOld1' => 'nullable|string|max:255',
        'newInstituteOld2' => 'nullable|string|max:255',
        'newUrl' => 'nullable|string|url|max:255',
        'info' => 'nullable|string|max:255',
        'franchise' => 'sometimes|boolean',
    ]);

    // Check if an institute with the same name and franchise status already exists in the given country ID
    $instituteExistsQuery = ForeignInstituteRegistry::query()
        ->where('country_id', $validatedData['newCountryId'] ?? $foreignInstitute->country_id)
        ->where('institute', $validatedData['newInstitute'])
        ->where('franchise', $validatedData['franchise'])
        ->where('info', $validatedData['info']);

    // If we are updating an existing institute, exclude it from the check
    if ($foreignInstitute->exists) {
        $instituteExistsQuery->where('id', '!=', $foreignInstitute->id);
    }

    $existingInstitute = $instituteExistsQuery->first();

    if ($existingInstitute) {
        return response()->json([
            'message' => 'Cannot be added. An institute with the same name and franchise status already exists in the selected country.'
        ], 422); // 422 Unprocessable Entity
    }

    // Filter out null values from the validated data, except for 'info'
    $validatedData = array_filter($validatedData, function ($value, $key) {
        return in_array($key, ['info', 'newInstituteEl', 'newInstituteOriginal', 'newUrl', 'newInstituteOld1', 'newInstituteOld2']) || !is_null($value);
    }, ARRAY_FILTER_USE_BOTH);

    // Check if newCountryId is set and update the country_id field
    if (isset($validatedData['newCountryId'])) {
        $foreignInstitute->country_id = $validatedData['newCountryId'];
    }

    // Check if newInstitute is set and update the institute field
    if (isset($validatedData['newInstitute'])) {
        $foreignInstitute->institute = $validatedData['newInstitute'];
    }
    $foreignInstitute->institute_el = $validatedData['newInstituteEl'];
    $foreignInstitute->institute_original = $validatedData['newInstituteOriginal'];
    $foreignInstitute->institute_old_1 = $validatedData['newInstituteOld1'];
    $foreignInstitute->institute_old_2 = $validatedData['newInstituteOld2'];
    $foreignInstitute->url = $validatedData['newUrl'];

    // Update the foreign institute with non-null validated data
    $foreignInstitute->fill($validatedData)->save();

    // Return a response, could be the updated institute or a success message
    return response()->json($foreignInstitute, 200);
}



    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ForeignInstituteRegistry  $foreignInstitute
     * @return \Illuminate\Http\Response
     */
    public function destroy(ForeignInstituteRegistry $foreignInstitute)
    {
        // Perform the delete operation
        $foreignInstitute->delete();

        // Return a success response
        return response()->json(['message' => 'Foreign institute deleted successfully'], 200);
    }
}
