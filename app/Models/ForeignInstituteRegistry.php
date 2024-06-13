<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForeignInstituteRegistry extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'foreign_institutes_registry';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'country_id',
        'institute',
        'institute_el',
        'institute_original',
        'institute_old_1',
        'institute_old_2',
        'url',
        'info',
        'franchise'
    ];

    /**
     * Get the country that the institute is associated with.
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}
