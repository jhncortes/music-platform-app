<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Returns the authenticated user along with their profile information
    public function getUser(Request $request)
    {
        $user = $request->user(); // or User::find($id)

        // Load profile relation if not eager loaded
        $user->load('profile');

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'avatar' => $user->profile?->avatar, // null-safe access
            'bio' => $user->profile?->bio,
            // add other profile fields if needed
        ]);
}
}
