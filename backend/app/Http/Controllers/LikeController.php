<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    // Creates a row on likes
    public function like(Request $request, $trackId)
    {
        $track = Track::findOrFail($trackId);
        $request->user()->likedTracks()->syncWithoutDetaching([$track->id]);

        return response()->json(['message' => 'Liked successfully']);
    }
    
    // Removes a row on likes
    public function unlike(Request $request, $trackId)
    {
        $track = Track::findOrFail($trackId);
        $request->user()->likedTracks()->detach($track->id);

        return response()->json(['message' => 'Unliked successfully']);
    }


}