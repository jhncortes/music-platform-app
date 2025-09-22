<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\UserController;

// Public routes
Route::apiResource('/tracks', TrackController::class)->only(['index', 'show']);
Route::get('/profile', [ProfileController::class, 'updateProfile']);
Route::get('/user/{username}', [UserController::class, 'getUserByUsername']);
Route::post('/comment', [CommentController::class, 'storeComment']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Tracks
    Route::apiResource('/tracks', TrackController::class)->only(['store', 'destroy']);
    // Likes
    Route::post('/tracks/{trackId}/like', [LikeController::class, 'like']);
    Route::delete('/tracks/{trackId}/unlike', [LikeController::class, 'unlike']);
    // Follows
    Route::post('/user/{userId}/follow', [FollowController::class, 'follow']);
    Route::delete('/user/{userId}/unfollow', [FollowController::class, 'unfollow']);
    // Users
    Route::get('/user', [UserController::class, 'getUser']);
    // Comments
    Route::delete('/comment/{commentId}', [CommentController::class, 'deleteComment']);
});




