package com.example.clipapp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.core.app.NotificationCompat;


public class MyForegroundService extends Service {
    private static final String CHANNEL_ID = "ClipAppChannel";
    public static final String ACTION_SYNC = "com.example.clipapp.ACTION_SYNC";
    @Override
    public void onCreate() {
        super.onCreate();
        // Create the notification channel as soon as the service is created
        createNotificationChannel();
    }

//Sync button functioning is decided from here.

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Example action: Sync button
        Intent syncIntent = new Intent(this, ClipboardSyncActivity.class);
        syncIntent.setAction(ACTION_SYNC);

        PendingIntent syncPendingIntent = PendingIntent.getActivity(
                this,
                0,
                syncIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );


        // Build notification that goes in the notification bar
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("ClipApp is running")
                .setSmallIcon(R.drawable.ic_launcher_foreground) // must exist
                .addAction(R.drawable.ic_launcher_foreground, "Sync", syncPendingIntent)
                .setOngoing(true) // PERSISTENT
                .build();

        // Start foreground service with notification
        startForeground(1, notification);

        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

//    onTaskRemoved() is called when the app
//    is removed from the recent apps
//    list and this further make the notification disappear
    @Override
    public void onTaskRemoved(Intent rootIntent) {
        super.onTaskRemoved(rootIntent);
        stopForeground(true); // removes the notification
        stopSelf();           // stop the service
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,                      // ID
                    "ClipApp Service Channel",       // Visible in phone settings
                    NotificationManager.IMPORTANCE_LOW // Low = no sound, just visible
            );

            // Optional: description (visible in system settings)
            serviceChannel.setDescription("Shows ClipApp foreground service status");

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }
}
