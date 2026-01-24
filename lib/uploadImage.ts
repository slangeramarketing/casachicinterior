export async function uploadImage(
  file: File,
  type: "blogs" | "projects" | "services" | "common" = "common"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  // 🔥 IMPORTANT: absolute URL for server actions
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
    "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/uploads`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  const data = await res.json();

  console.log("JSON Upload-Image API Response: ",data);

  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Image upload failed");
  }

  return data.url;
}
