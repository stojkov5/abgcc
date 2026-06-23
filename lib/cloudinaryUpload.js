import cloudinary from "@/lib/cloudinary";

// Shared Cloudinary upload helpers. Used by the admin upload + event gallery
// routes so file uploads and remote URLs both end up stored in Cloudinary.

export function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

export function uploadUrlToCloudinary(url, folder) {
  // Cloudinary fetches the remote image and stores its own copy, so it's then
  // served fast from the CDN instead of the original (possibly slow) host.
  return cloudinary.uploader.upload(url, { folder, resource_type: "image" });
}

/**
 * Reads an image from a Web Request — either a multipart `file` field or a JSON
 * body `{ url }` — uploads it to Cloudinary, and returns the secure URL.
 * Throws when no usable image is provided.
 */
export async function uploadImageFromRequest(request, folder) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    const url = (body?.url || "").trim();
    if (!url) throw new Error("No image URL provided.");
    const result = await uploadUrlToCloudinary(url, folder);
    return result.secure_url;
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file) throw new Error("No image provided.");

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadBufferToCloudinary(buffer, folder);
  return result.secure_url;
}
