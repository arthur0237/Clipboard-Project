
export async function downloadFile(filename) {
  try{
    // 1. Ask backend for a presigned download URL
    
  const res = await fetch(`http://localhost:5000/get-download-url?filename=${filename}`);
  console.log(res); 
  const { url } = await res.json();
  return { url };
  }
  catch (err) {
    console.error(" Download failed:", err);
  }

}














//   Step-by-step of that code:
// // Step 1: Create a new <a> element in memory
// const a = document.createElement("a");

// // Step 2: Point it to your file URL
// a.href = url;

// // Step 3: Add the "download" attribute
// // This tells browser: “don’t open, just save the file”
// a.download = filename;

// // Step 4: Temporarily add <a> to the page
// document.body.appendChild(a);

// // Step 5: Pretend user clicked it (triggers download)
// a.click();

// // Step 6: Remove <a> again (cleanup, no extra elements left)
// document.body.removeChild(a);


// ✅ So basically:

// We create a fake download link.

// Click it programmatically.

// The browser thinks the user clicked “download” → file goes to Downloads folder.