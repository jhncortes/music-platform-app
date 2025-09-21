<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Create comment object and store in DB
    public function storeComment(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'trackId' => 'required|integer|exists:tracks,id',
            'comment' => 'required|string|max:255',
        ]);

        // Create comment
        $comment = Comment::create([
            'user_id' => $validated['userId'],
            'track_id' => $validated['trackId'],
            'comment' => $validated['comment'],
        ]);

        // Return created comment as JSON with 201 status
        return response()->json($comment, 201);
    }
}
