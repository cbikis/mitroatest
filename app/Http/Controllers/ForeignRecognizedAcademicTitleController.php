<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\ForeignRecognizedAcademicTitle;

class ForeignRecognizedAcademicTitleController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
public function store(Request $request)
{    // Custom error messages
    $messages = [
        'country_id.required' => 'The country field is required.',
        'title.required'      => 'The title field is required.',
        'title_type.required' => 'The title type field is required.',
        'required'            => 'Please fill out all required fields.', // General message for any required field
    ];



    // Validate the request data with custom messages
    $validatedData = $request->validate([
        'country_id' => 'required|exists:countries,id',
        'title' => [
            'required',
            'string',
            'max:255',
            Rule::unique('foreign_recognized_academic_titles')->where(function ($query) use ($request) {
                return $query->where('country_id', $request->country_id);
            }),
        ],
        'title_type' => 'required|string|max:255',
        'info' => 'nullable|string|max:255',
    ], $messages);

    // Create a new foreign academic title
    $foreignAcademicTitle = ForeignRecognizedAcademicTitle::create($validatedData);

    // Load the related country to access its name
    $foreignAcademicTitle->load('country');

    // Prepare the response data in the specific order
    $responseData = [
        'id'            => $foreignAcademicTitle->id,
        'country'       => $foreignAcademicTitle->country->country, // Assuming 'country' is the column name in the 'countries' table
        'title'         => $foreignAcademicTitle->title,
        'title_type'    => $foreignAcademicTitle->title_type,
        'info'          => $foreignAcademicTitle->info,
    ];

    // Return a response with the created title and country name
    return response()->json($responseData, 201);
}


    public function getTitlesByCountry($countryId)
    {
        // Fetch titles based on the country_id
        $titles = ForeignRecognizedAcademicTitle::where('country_id', $countryId)->get();

        // Return the titles as a JSON response
        return response()->json($titles);
    }

public function update(Request $request, ForeignRecognizedAcademicTitle $title)
{
    // Validate the request data
    $validatedData = $request->validate([
        'country_id' => 'sometimes|exists:countries,id',
        'title' => 'sometimes|string|max:255',
        'title_type' => 'sometimes|string|max:255',
        'info' => 'nullable|string|max:255',
    ]);

    // Check for duplicates if country_id, title, and title_type are provided
    if (isset($validatedData['country_id'], $validatedData['title'], $validatedData['title_type'])) {
        $duplicateTitle = ForeignRecognizedAcademicTitle::where('country_id', $validatedData['country_id'])
            ->where('title', $validatedData['title'])
            ->where('title_type', $validatedData['title_type'])
            ->where('info', $validatedData['info'])
            ->exists();

        if ($duplicateTitle) {
            // Return an error response if a duplicate title is found
            return response()->json(['message' => 'A title with the specified country_id, title, and title_type already exists in the database.'], 422);
        }
    }

    // Filter out null values from the validated data, except for 'info'
    $validatedData = array_filter($validatedData, function ($value, $key) {
        return $key === 'info' || !is_null($value);
    }, ARRAY_FILTER_USE_BOTH);

    // Update the existing title with validated data
    $title->update($validatedData);

    // Return a response, could be the updated title or a success message
    return response()->json($title->fresh(), 200);

}




    public function index()
    {
        // Fetch all academic titles along with the associated country name
        $academicTitles = ForeignRecognizedAcademicTitle::join('countries', 'foreign_recognized_academic_titles.country_id', '=', 'countries.id')
            ->select('foreign_recognized_academic_titles.id', 'foreign_recognized_academic_titles.country_id', 'countries.country', 'foreign_recognized_academic_titles.title', 'foreign_recognized_academic_titles.title_type', 'foreign_recognized_academic_titles.info')
            ->get();

        // Return the academic titles as a JSON response
        return response()->json($academicTitles);
    }

    public function destroy(ForeignRecognizedAcademicTitle $title)
    {
        // Perform the delete operation
        $title->delete();

        // Return a success response
        return response()->json(['message' => 'Foreign institute deleted successfully'], 200);
    }
}
