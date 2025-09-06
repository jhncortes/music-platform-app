<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Track extends Model
{
    protected $fillable = [
        'userId',
        'imageUrl',
        'audioUrl',
        'title',
        'description',
        'genre'
    ];

    // A Track belongs to a User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
