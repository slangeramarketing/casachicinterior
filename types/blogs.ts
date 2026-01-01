// types/blogs.ts



/* -------------------------------------
   Blog Status
------------------------------------- */
export type BlogStatus = "draft" | "published";

export interface BlogAuther{
    id:string;
    name?:string;
    avatar:string
}

/* -------------------------------------
   SEO (UI + DTO SAFE)
------------------------------------- */
export interface BlogSEO {
  metaTitle: string;
  metaDescription: string;
}

/* -------------------------------------
   FULL Blog DTO (Server → Client)
------------------------------------- */
export interface BlogDTO {
  _id: string;

  title: string;
  slug: string;

  description: string;
  richText: string;

  thumbnailImage: string;

  category: string;
  subCategory: string;

  status: BlogStatus;
  featured: boolean;

  author: BlogAuther;

  seo: BlogSEO; // ✅ ALWAYS PRESENT FOR UI

  publishedAt?: string;

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------
   CREATE / UPDATE DTO (Client → Server)
   ❌ author NOT allowed here
------------------------------------- */
export interface CreateBlogDTO {
  title: string;
  slug: string;

  description: string;
  richText: string;

  thumbnailImage: string;

  category: string;
  subCategory: string;

  status: BlogStatus;
  featured: boolean;

  seo: BlogSEO; // ✅ REQUIRED
}

/* -------------------------------------
   BLOG LIST ITEM DTO
------------------------------------- */
export type BlogListItemDTO = Pick<
  BlogDTO,
  | "_id"
  | "title"
  | "slug"
  | "thumbnailImage"
  | "category"
  | "status"
  | "featured"
  | "updatedAt"
>;

/* -------------------------------------
   Mapper: Mongo → BlogDTO
------------------------------------- */
export function mapBlogToDTO(doc: any): BlogDTO {
  return {
    _id: doc._id.toString(),

    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    richText: doc.richText,

    thumbnailImage: doc.thumbnailImage,

    category: doc.category,
    subCategory: doc.subCategory,

    status: doc.status,
    featured: doc.featured,

    author: {
      id: doc.author._id.toString(),
      name: doc.author.name,
      avatar: doc.author.avatar || "",
    },

    seo: {
      metaTitle: doc.seo?.metaTitle || "",
      metaDescription: doc.seo?.metaDescription || "",
    },

    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}


/* -------------------------------------
   Mapper: Mongo[] → BlogDTO[]
------------------------------------- */
export function mapBlogsToDTO(docs: any[]): BlogDTO[] {
  return docs.map(mapBlogToDTO);
}