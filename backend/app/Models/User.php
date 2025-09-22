<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    // Returns user's profile information
    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id', 'id');
    }

    // Returns the user's liked tracks
    public function likedTracks()
    {
        return $this->belongsToMany(Track::class, 'likes', 'user_id', 'track_id')
            ->withTimestamps();
    }

    // Returns all followers from THIS user
    public function followers() {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')
            ->select('users.id', 'users.username', 'users.name')
            ->with('profile:user_id,image_url')
            ->withTimestamps();
    }


    // Returns all followings users THIS user is following
    public function following() {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')
            ->select('users.id', 'users.username', 'users.name')
            ->with('profile:user_id,image_url')
            ->withTimestamps();
    }


}
