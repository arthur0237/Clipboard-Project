export async function uploadFile(file) {
  const res = await fetch("http://127.0.0.1:5000/get-upload-url?filename=" + file.name);
  const { url } = await res.json();
  console.log(url);
  await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  console.log("✅ File uploaded to S3");
}
