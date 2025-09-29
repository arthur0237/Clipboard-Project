package com.example.clipapp;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

public class ClipboardSyncActivity extends Activity {
    @Override
    public void finish() {
        super.finish();
        Log.d("ActivityLifecycle", "finish() called for " + this.getClass().getSimpleName());
    }


    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if(hasFocus) {
            ClipContent();
            finish();
        }
    }

    void ClipContent(){
        ClipboardManager clipboard =
                (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);

        if (clipboard != null && clipboard.hasPrimaryClip()) {
            ClipData clipData = clipboard.getPrimaryClip();
            if (clipData != null && clipData.getItemCount() > 0) {
                CharSequence copiedText = clipData.getItemAt(0).getText();

                if (copiedText != null) {
                    // 👉 Do something with it (Toast for now)
                    Toast.makeText(this, "Clipboard: " + copiedText, Toast.LENGTH_SHORT).show();
                }
            }
        } else {
            Toast.makeText(this, "Clipboard is empty", Toast.LENGTH_SHORT).show();
        }

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Close the activity immediately after work is done
    }
}
