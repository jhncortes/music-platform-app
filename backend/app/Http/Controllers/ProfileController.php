<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; 
use App\Services\S3Service; // Import the S3Service
use AWS\CRT\Log;
use Illuminate\Support\Facades\Log as FacadesLog;

class ProfileController extends Controller
{
    protected $s3Service;

    public function __construct(S3Service $s3Service) {
        $this->s3Service = $s3Service;
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateProfile(Request $request, string $id)
    {
        // Find the user profile
        $userProfile = Profile::findOrFail($id);

        // Validate fields (optional)
        $validated = $request->validate([
            'bio' => 'nullable|string|max:255',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        $imagePresignedUrl = null;

        // Handle avatar if uploaded
        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $extension = $imageFile->extension();

            // Generate presigned URL for S3 upload
            $s3Key = "images/profile-pics/{$id}.{$extension}";
            $imagePresignedUrl = $this->s3Service->getPresignedUrl(
                env('AWS_BUCKET'),
                $s3Key,
                60, // expiry in minutes
                $imageFile->getMimeType()
            );
            // Get the appropriate URL without presigned parameters
            $imageUrl = explode('?', $imagePresignedUrl)[0];
            // Store the S3 key (or URL) in the validated array
            $validated['image_url'] = $imageUrl; 
        }

        // Update user profile with whatever fields are present
        $userProfile->update($validated);

        return response()->json([
            'message' => 'User profile successfully updated',
            'data' => $userProfile,
            'presignedUrl' => $imagePresignedUrl, // return presigned URL for client to upload
        ], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function deleteProfile(string $id)
    {
        //
    }
}
