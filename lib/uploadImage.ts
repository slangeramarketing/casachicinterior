// local or production dono ke liye same uploadImage.ts file code


export async function uploadImage(
  file: File,
  type: "blogs" | "projects" | "services" | "profile" | "common" = "common"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  console.log(`[Client] Uploading ${file.name} (${type}) to /api/uploads...`);

  try {
    const res = await fetch(`/api/uploads`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    const data = await res.json();

    console.log("[Client] JSON Upload-Image API Response: ", data);

    if (!res.ok || !data.success) {
      console.error("[Client] Upload failed:", data?.message || "Unknown error");
      throw new Error(data?.message || "Image upload failed");
    }

    return data.url;
  } catch (error) {
    console.error("[Client] Upload Exception:", error);
    throw error;
  }
}
