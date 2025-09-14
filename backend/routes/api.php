<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\UserController;
use App\Models\Profile;
use App\Models\User;


Route::get('/user/{username}', function ($username) {

    $user = User::select('id', 'name', 'username')
        ->where('username', $username)
        ->first();

    $profile = Profile::select('id', 'avatar', 'bio')
        ->where('userId', $user->id)
        ->first();

    if (!$user) {
        return response()->json(null, 404);
    }
    return response()->json([
        'user' => $user,
        'profile' => $profile
    ]);
});

Route::get('/user/{userId}/tracks', [TrackController::class, 'getByUserId']);


Route::apiResource('/tracks', TrackController::class)
    ->only(['index', 'store', 'show', 'destroy']);

Route::apiResource('/profile', ProfileController::class);


Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getUser']);
