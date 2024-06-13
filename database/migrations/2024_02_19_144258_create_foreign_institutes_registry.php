<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('foreign_institutes_registry', function (Blueprint $table) {
            $table->id();
            // Add a country_id column to reference the countries table
            $table->unsignedBigInteger('country_id');
            $table->string('institute');
            $table->string('institute_original')->nullable()->default(null);
            $table->string('institute_old_1')->nullable()->default(null);
            $table->string('institute_old_2')->nullable()->default(null);
            $table->string('institute_el')->nullable()->default(null);
            $table->string('url')->nullable()->default(null);
            $table->string('info')->nullable()->default(null);
            $table->boolean('franchise');
            $table->timestamps();

            // Add the foreign key constraint
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foreign_institutes_registry');
    }
};
