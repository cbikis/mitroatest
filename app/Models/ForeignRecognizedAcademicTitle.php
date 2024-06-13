<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForeignRecognizedAcademicTitle extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'foreign_recognized_academic_titles';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'country_id',
        'title',
        'title_type',
        'info',
    ];

    /**
     * Get the country that the academic title is associated with.
     */
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }
}
