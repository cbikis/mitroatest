<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\ForeignInstituteController;
use App\Http\Controllers\ForeignRecognizedAcademicTitleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['message' => 'CSRF cookie set']);
})->middleware('web');




Route::middleware('web')->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
    Route::get('/countries', [CountryController::class, 'index']);
    Route::get('/foreign-institutes', [ForeignInstituteController::class, 'index']);
    Route::get('/titles', [ForeignRecognizedAcademicTitleController::class, 'index']);
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/add-country', [CountryController::class, 'store']);
        Route::post('/add-foreign-institute', [ForeignInstituteController::class, 'store']);
        Route::post('/add-foreign-title', [ForeignRecognizedAcademicTitleController::class, 'store']);
        Route::put('/edit-country/{country}', [CountryController::class, 'update']);
        Route::put('/edit-foreign-institute/{foreignInstitute}', [ForeignInstituteController::class, 'update']);
        Route::put('/edit-foreign-title/{title}', [ForeignRecognizedAcademicTitleController::class, 'update']);
        Route::get('/titles/country/{countryId}', [ForeignRecognizedAcademicTitleController::class, 'getTitlesByCountry']);
        Route::get('/foreign-institutes/country/{countryId}', [ForeignInstituteController::class, 'indexByCountry']);
        Route::delete('/delete-country/{country}', [CountryController::class, 'destroy']);
        Route::delete('/institutes/{foreignInstitute}', [ForeignInstituteController::class, 'destroy']);
        Route::delete('/titles/{title}', [ForeignRecognizedAcademicTitleController::class, 'destroy']);
        Route::post('/logout', [LoginController::class, 'logout']);
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
    });
});
