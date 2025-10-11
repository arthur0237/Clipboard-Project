package com.example.clipapp;

// 1. is the tunnel is created correctly ?????????????

// 2. I am not using Android Client for
// googl-OAuth -- using the existing Web Client
// that I used for pc --- correct or not ??????????

// 3. token is not being saved --
// each time I open the app --
// I am getting the consent screen --- this should happen ?????

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;
import com.google.android.gms.auth.api.signin.*;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import retrofit2.*;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.POST;

public class LoginActivity extends AppCompatActivity {

    private static final int RC_SIGN_IN = 1000;
    private GoogleSignInClient googleClient;

    // Retrofit setup
    interface ApiService {
        @POST("/auth/google/2")
        Call<AuthResponse> sendGoogleCode(@Body AuthRequest body);
    }

    static class AuthRequest {
        String code;
        AuthRequest(String code) { this.code = code; }
    }

    static class AuthResponse {
        String token;
        String email;
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // If already logged in, skip login
        if (getSharedPreferences("Auth", MODE_PRIVATE).getString("jwt", null) != null) {
            goToMain();
            return;
        }

        setContentView(R.layout.activity_login);

        // Configure Google Sign-In
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestServerAuthCode(getString(R.string.web_client_id), true)
                .build();

        googleClient = GoogleSignIn.getClient(this, gso);
        signIn(); // directly open Google popup
    }

    private void signIn() {
        Intent signInIntent = googleClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                GoogleSignInAccount account = task.getResult(ApiException.class);
                String code = account.getServerAuthCode();
                Toast.makeText(this, "Welcome " + account.getEmail(), Toast.LENGTH_SHORT).show();

//                I think the things are not working from here. ???
//                ek bar gpt se puch lena authentication flow -- mere code ka.

                sendCodeToBackend(code);
            } catch (ApiException e) {
                Log.e("SignIn", "Failed: " + e.getStatusCode());
                Toast.makeText(this, "Sign-in failed", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void sendCodeToBackend(String code) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://shy-dragons-cheat.loca.lt") // your backend URL
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        ApiService api = retrofit.create(ApiService.class);

        api.sendGoogleCode(new AuthRequest(code)).enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                if (response.isSuccessful()) {
                    String jwt = response.body().token;
                    Log.d("tiwari","Ashutosh checking jwt is being saved or not?????");
                    getSharedPreferences("Auth", MODE_PRIVATE).edit().putString("jwt", jwt).apply();
                    goToMain();
                } else {
                    Toast.makeText(LoginActivity.this, "Server error", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                Log.e("Backend", "Failed", t);
            }
        });
    }

    private void goToMain() {
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }
}
