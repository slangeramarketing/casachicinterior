export async function uploadImage(
  file: File,
  type: "blogs" | "projects" | "services" |"profile"| "common" = "common"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await fetch(`/api/uploads`, {
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
