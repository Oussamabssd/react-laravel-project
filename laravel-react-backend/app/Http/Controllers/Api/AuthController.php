<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    public function Login(LoginRequest $request) {
        try {
            // Validate the incoming login request using the LoginRequest class
            $credentials = $request->validated();

            // Attempt to authenticate the user with the provided credentials
            if (!Auth::attempt($credentials)) {
                // If authentication fails, return an error response with status 401 (Unauthorized)
                return response([
                    "message" => "Provided email or password is incorrect", // Error message
                ],422);
            }

            // If authentication is successful, retrieve the authenticated user
            $user = Auth::user();

            // Generate a new API token for the authenticated user
            $token = $user->createToken("main")->plainTextToken;

            // Return a response containing the user information and the generated token
            return response(compact('user', 'token'), 201); // HTTP status code 201 (Created)
        } catch (\Exception $e) {
            // Handle any unexpected exceptions
            return response([
                "message" => "An error occurred during login.",
                "error" => $e->getMessage(),
                "status" => 500 // HTTP status code 500 (Internal Server Error)
            ]);
        }
    }

    public function Signup(SignupRequest $request) {
        try {
            // Validate the incoming signup request using the SignupRequest class
            $data = $request->validated();

            // Create a new user with the validated data
            $user = User::create([
                'name' => $data['name'], // User's name
                'email' => $data['email'], // User's email
                'password' => bcrypt($data['password']) // Hash the password before storing it
            ]);

            // Generate a new API token for the newly registered user
            $token = $user->createToken("main")->plainTextToken;

            // Return a response containing the user information and the generated token
            return response()->json([
                'user' => $user,
                'token' => $token
            ], 201); // HTTP status code 201 (Created)
        } catch (\Exception $e) {
            // Handle any unexpected exceptions and return the error in JSON format
            return response()->json([
                "message" => "An error occurred during signup.",
                "error" => $e->getMessage(),
                "status" => 500 // HTTP status code 500 (Internal Server Error)
            ], 500);
        }
    }

    public function Logout(Request $request) {
        try {
            // Get the authenticated user
            $user = Auth::user();
            if ($user) {
                // Delete the current access token for the authenticated user
                $request->user()->currentAccessToken()->delete();
                // Return a success message after logging out
                return response([
                    "message" => "Logged out successfully", // Confirmation message
                    "status" => 200 // HTTP status code 200 (OK)
                ]);
            }
        } catch (\Exception $e) {
            // Handle any unexpected exceptions
            return response([
                "message" => "An error occurred during logout.",
                "error" => $e->getMessage(),
                "status" => 500 // HTTP status code 500 (Internal Server Error)
            ]);
        }
    }
}
