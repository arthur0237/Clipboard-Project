export async function uploadFile(file) {
  // 1. Ask backend for a presigned URL
  const res = await fetch(`/get-upload-url?filename=${file.name}&contentType=${file.type}`);
  const { url } = await res.json();

  // 2. Upload file directly to S3
  const upload = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (upload.ok) {
    console.log("Upload successful!");
  } else {
    console.error(" Upload failed", upload.statusText);
  }
}

// Was to just test the upload 

// Example usage with <input type="file">
// document.querySelector("#fileInput").addEventListener("change", (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     uploadFile(file);
//   }
// });
