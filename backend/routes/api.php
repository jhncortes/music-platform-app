<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\UserController;
use App\Models\Profile;
use App\Models\User;


//Route::get('/user/{userId}/tracks', [TrackController::class, 'getByUserId']);


Route::apiResource('/tracks', TrackController::class)
    ->only(['index', 'store', 'show', 'destroy']);

Route::apiResource('/profile', ProfileController::class);


Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getUser']);
Route::get('/user/{username}', [UserController::class, 'getUserByUsername']);

Route::post('/comment', [CommentController::class, 'storeComment']);

