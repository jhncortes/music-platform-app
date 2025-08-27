<?php

namespace App\Http\Controllers;

use App\Models\Track;
use App\Http\Controllers\Controller;
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
    public function index()
    {
        //
        return Track::latest()
        ->get()
        ->map(function ($track) {
            return [
                'id' => $track->id,
                'url' => $track->path,
                'title' => $track->title,
                'created_at' => $track->created_at,
                'updated_at' => $track->updated_at,
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
        //
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg'],
        ]);

        //$path = $request->file('image')->store('images', 'public');
        $presignedUrl = $this->s3Service->getPresignedUrl(env('AWS_BUCKET'), 'cover-photo/climber.png', 60, 'PUT');
        $path = explode('?', $presignedUrl)[0]; // Remove query parameters for storage path


        Track::create([
            'path' => $path,
            'title' => $request->title,
        ]);



        return response($presignedUrl, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Track $track)
    {
        //
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
