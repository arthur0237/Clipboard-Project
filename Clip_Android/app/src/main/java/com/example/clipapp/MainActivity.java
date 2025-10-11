package com.example.clipapp;

// code samajh nahi aaa raha
//--- high level flow to samajh aaa raha hai --- code ka flow samajh nahi aaa raha

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity {

    private static final int REQUEST_CODE_POST_NOTIFICATIONS = 101;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Log.d("Ashutosh", "MainActivity is called");

//        // 🔹 DELETE the saved JWT token (for testing)
//        getSharedPreferences("Auth", MODE_PRIVATE)
//                .edit()
//                .remove("jwt")   // remove only the jwt key
//                .apply();
//
//        Toast.makeText(this, "JWT deleted successfully!", Toast.LENGTH_SHORT).show();

//       // Just to display the jwt token.
        String jwt = getSharedPreferences("Auth", MODE_PRIVATE).getString("jwt", "none");
        ((TextView) findViewById(R.id.textView)).setText("Your JWT:\n" + jwt);

        // Ask for notification permission (Android 13+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS},
                        REQUEST_CODE_POST_NOTIFICATIONS);
            } else {
                startMyService();
            }
        } else {
            // For Android < 13, no runtime permission needed ????
            startMyService();
        }
    }

    private void startMyService() {
        Intent serviceIntent = new Intent(this, MyForegroundService.class);
        ContextCompat.startForegroundService(this, serviceIntent);
    }

    // Handle the permission request result
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_CODE_POST_NOTIFICATIONS) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted → start service
                startMyService();
            } else {
                // Permission denied → you might want to show a message
                Toast.makeText(this, "Access denied", Toast.LENGTH_SHORT).show();

            }
        }
    }
}
