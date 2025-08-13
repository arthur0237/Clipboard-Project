export async function uploadFile(file) {
  const res = await fetch("/get-upload-url?filename=" + file.name);
  const { url } = await res.json();

  await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  console.log("✅ File uploaded to S3");
}
