<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Returns the authenticated user along with their profile information
    public function getUser(Request $request)
    {
        $user = $request->user(); 

        // Load profile relation if not eager loaded
        $user->load('profile');

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'profile' => [
                'username' => $user->username,
                'imageUrl' => $user->profile?->image_url, 
                'bio' => $user->profile?->bio,
                'followers' => $user->followers->count(),
                'following' => $user->following->count()
            ],
        ]);
    }

    // Returns user and profile information based on username
    public function getUserByUsername(Request $request, $username)
    {
        $user = User::select('id', 'name', 'username')
            ->where('username', $username)
            ->first();

        $profile = Profile::select('id', 'image_url', 'bio')
            ->where('user_id', $user->id)
            ->first();

        if (!$user || !$profile) {
            return response()->json(null, 404);
        }

        $authUser = $request->user();
        $isFollowing = false;

        if ($authUser) {
            $isFollowing = $user->followers()->where('follower_id', $authUser->id)->exists();
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'imageUrl' => $profile ? $profile->image_url : null,
            'bio' => $profile ? $profile->bio : null,
            'followers' => $user->followers->count(),
            'following' => $user->following->count(),
            'isFollowing' => $isFollowing

        ]);
    }
}
