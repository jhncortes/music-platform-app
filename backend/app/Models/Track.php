<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Track extends Model
{
    protected $fillable = [
        'user_id',
        'image_url',
        'audio_url',
        'title',
        'description',
        'genre'
    ];

    // A Track belongs to a User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Returns the track's likes
    public function likes()
    {
        return $this->belongsToMany(User::class, 'likes', 'track_id', 'user_id')
                    ->withTimestamps();
    }

}
