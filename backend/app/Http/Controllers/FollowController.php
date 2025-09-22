<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    // Adds a row in follows table
    public function follow(Request $request, $userId) {
        $user = User::findOrFail($userId);
        $request->user()->following()->syncWithoutDetaching([$user->id]);
        return response()->json(['message' => 'Followed successfully']);
    }

    // Removes a row in follows table
    public function unfollow(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $request->user()->following()->detach($user->id);
        return response()->json(['message' => 'Unfollowed successfully successfully']);
    }
}
