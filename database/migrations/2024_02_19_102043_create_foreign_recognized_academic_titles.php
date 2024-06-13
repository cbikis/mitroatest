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
        Schema::create('foreign_recognized_academic_titles', function (Blueprint $table) {
            $table->id();
            // Replace the 'country' column with 'country_id' to reference the 'countries' table
            $table->unsignedBigInteger('country_id');
            $table->string('title');
            $table->string('title_type');
            $table->string('info')->nullable()->default(null);;
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
        Schema::dropIfExists('foreign_recognized_academic_titles');
    }
};
