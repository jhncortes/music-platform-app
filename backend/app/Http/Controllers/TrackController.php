<?php

namespace App\Http\Controllers;

use App\Models\Track;
use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; 
use App\Services\S3Service; // Import the S3Service


class TrackController extends Controller
{

    protected $s3Service;

    public function __construct(S3Service $s3Service) {
        $this->s3Service = $s3Service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Track::withCount('likes')
            ->with(['user:id,username', 'user.profile:id,user_id,image_url,bio']);

        if ($request->has('userId')) {
            $query->where('user_id', $request->get('userId'));
        }

        $tracks = $query->latest()->get();
        $authUser = $request->user();

        return $tracks->map(function ($track) use ($authUser) {
            // Check if the authenticated user follows this track's creator
            $isFollowing = false;
            if ($authUser && $track->user) {
                $isFollowing = $track->user->followers()
                    ->where('follower_id', $authUser->id)
                    ->exists();
            }

            return [
                'id' => $track->id,
                'imageUrl' => $track->image_url,
                'audioUrl' => $track->audio_url,
                'title' => $track->title,
                'description' => $track->description,
                'genre' => $track->genre,
                'createdAt' => $track->created_at,
                'updatedAt' => $track->updated_at,
                'likes' => $track->likes_count,
                'isLiked' => $authUser ? $track->likes->contains($authUser->id) : false,
                'creatorProfile' => [
                    'id' => $track->user?->id,
                    'username' => $track->user?->username ?? null,
                    'imageUrl' => $track->user?->profile?->image_url ?? null,
                    'bio' => $track->user?->profile?->bio ?? null,
                    'followers' => $track->user?->followers->count() ?? null,
                    'isFollowing' => $isFollowing
                    
                ]

            ];
        });
    }





    // /**
    //  * Show the form for creating a new resource.
    //  */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'userId' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'genre' => 'required|string|max:255',
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg'],
            'audio' => ['required', 'mimes:mp3,wav'], // Only mimes for now
        ]);

        $imageFile = $request->file('image');
        $audioFile = $request->file('audio');

        $imagePresignedUrl = $this->s3Service->getPresignedUrl(
            env('AWS_BUCKET'),
            "images/track-photos/{$request->userId}/{$imageFile->getClientOriginalName()}",
            60,
            $imageFile->getMimeType()
        );

        $audioPresignedUrl = $this->s3Service->getPresignedUrl(
            env('AWS_BUCKET'),
            "audio/{$request->userId}/{$audioFile->getClientOriginalName()}",
            60,
            $audioFile->getMimeType()
        );

         // Remove query parameters for storage path
        $imageUrl = explode('?', $imagePresignedUrl)[0];
        $audioUrl = explode('?', $audioPresignedUrl)[0];


        // Store to DB
        Track::create([
            'user_id' => $request->userId,
            'image_url' => $imageUrl,
            'audio_url' => $audioUrl,
            'title' => $request->title,
            'description' => $request->description,
            'genre' => $request->genre,
        ]);

        

        return response()->json([
            'imagePresignedUrl' => $imagePresignedUrl,
            'audioPresignedUrl' => $audioPresignedUrl,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Track $track)
    {
        // Get user info
        $user = $track->user;
        $authUser = $request->user();
        // $userProfile = Profile::where('user_id', $track->user_id)->first();
        $isFollowing = false;

        if ($authUser) {
            // Check if the authenticated user's ID is in the followers of $user
            $isFollowing = $user->followers()->where('follower_id', $authUser->id)->exists();
            $isLiked = $track->likes()->where('user_id', $authUser->id)->exists();
        }
        $track->loadCount('likes');
        // Gets comments with the users details and info
        $comments = Comment::with(['user' => function ($query) {
                $query->select('id', 'username'); // only fetch these columns
            }, 'user.profile' => function ($query) {
                $query->select('id', 'user_id', 'image_url'); // include user_id for relation
            }])
            ->where('track_id', $track->id)
            ->latest()
            ->get()
            ->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'comment' => $comment->comment,
                    'createdAt' => $comment->created_at,
                    'user' => [
                        'id' => $comment->user->id,
                        'username' => $comment->user->username,
                        'profile' => [
                            'imageUrl' => $comment->user->profile->image_url ?? null,
                        ],
                    ],
                ];
            });

        return response()->json([
            'id' => $track->id,
            'imageUrl' => $track->image_url,
            'audioUrl' => $track->audio_url,
            'title' => $track->title,
            'description' => $track->description,
            'genre' => $track->genre,
            'createdAt' => $track->created_at,
            'updatedAt' => $track->updated_at,
            'likes' => $track->likes_count,
            'isLiked' => $isLiked,
            'comments' => $comments,
            'creatorProfile' => [
                'id' => $track->user?->id,
                'username' => $track->user?->username ?? null,
                'imageUrl' => $track->user?->profile?->image_url ?? null,
                'bio' => $track->user?->profile?->bio ?? null,
                'followers' => $track->user?->followers->count() ?? null,
                'isFollowing' => $isFollowing
            ]
        ]);
    }
    

    // /**
    //  * Show the form for editing the specified resource.
    //  */
    // public function edit(Track $track)
    // {
    //     //
    // }

    // /**
    //  * Update the specified resource in storage.
    //  */
    // public function update(Request $request, Track $track)
    // {
    //     //
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Track $track)
    {
        //
        $track->delete();

        return response(null, 204);
    }
}
