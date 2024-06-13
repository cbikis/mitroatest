<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function index()
    {
        // Retrieve all countries
        $countries = Country::all(['id', 'country']);

        // Return the countries as a JSON response
        return response()->json($countries);
    }

    /**
     * Store a newly created country in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        // Custom error messages
        $messages = [
            'country.unique' => 'The specified country already exists in the database.',
        ];
        // Validate the request data
        $validatedData = $request->validate([
            'country' => 'required|string|max:255|unique:countries,country',
        ], $messages);

        // Create a new country instance and save it to the database
        $country = Country::create($validatedData);

        // Return a response with the created country data
        return response()->json($country, 201);
    }

    public function update(Request $request, Country $country)
    {
        // Validate the request
        $validatedData = $request->validate([
            'country' => 'required|string|max:255',
        ]);

        // Update the country's name
        $country->country = $validatedData['country'];
        $country->save();

        // Return a response
        return response()->json(['message' => 'Country updated successfully.']);
    }

    public function destroy(Country $country)
    {
        // Delete the country
        $country->delete();

        // Return a response indicating success
        return response()->json(['message' => 'Country deleted successfully.']);
    }
}
