package com.example.clipapp;

import android.content.BroadcastReceiver;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

public class SyncReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (MyForegroundService.ACTION_SYNC.equals(intent.getAction())) {
            ClipboardManager clipboard =
                    (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);

            if (clipboard != null && clipboard.hasPrimaryClip()) {
                ClipData clipData = clipboard.getPrimaryClip();
                if (clipData != null && clipData.getItemCount() > 0) {
                    CharSequence copiedText = clipData.getItemAt(0).getText();

                    if (copiedText != null) {
                        // 👉 Do something with it (Toast for now)
                        Toast.makeText(context, "Clipboard: " + copiedText, Toast.LENGTH_SHORT).show();
                    }
                }
            } else {
                Toast.makeText(context, "Clipboard is empty", Toast.LENGTH_SHORT).show();
            }
        }
    }
}

