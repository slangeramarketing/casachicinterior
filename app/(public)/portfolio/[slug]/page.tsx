import { ResolvingMetadata, Metadata } from "next";
import { MaterialSpecDTO } from "@/modules/portfolio/portfolio.dto";
import { notFound } from "next/navigation";
import { getPortfolioProjectBySlug, getPortfolioProjects } from "@/modules/portfolio/portfolio.server";
import ProjectDetailHero from "@/components/public/portfolio/ProjectDetailHero";
import VisualShowcase from "@/components/public/portfolio/VisualShowcase";
import ProjectSpecs from "@/components/public/portfolio/ProjectSpecs";
import ProjectSocialProof from "@/components/public/portfolio/ProjectSocialProof";
import PortfolioGenerator from "@/components/public/portfolio/PortfolioGenerator";
import PortfolioFooter from "@/components/public/portfolio/PortfolioFooter";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * SEO METADATA GENERATION
 */
export async function generateMetadata(
  { params }: ProjectPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioProjectBySlug(slug);

  if (!project) return { title: "Project Not Found | CasaChic Interior" };

  return {
    title: `${project.title} | ${project.location} | CasaChic`,
    description: `Detailed transformation of ${project.title} in ${project.location}. Fixed pricing: ${project.costRange}. Featuring premium brands like ${project.materialSpecList.map((m: MaterialSpecDTO) => m.brand).join(", ")}.`,
    openGraph: {
      images: [project.afterImg],
    },
  };
}

/**
 * STATIC PARAMS FOR OPTIMIZATION
 */
export async function generateStaticParams() {
  const projects = await getPortfolioProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPortfolioProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Get all projects for the PDF generator (keeping the existing logic for now)
  const allProjects = await getPortfolioProjects();

  return (
    <main className="relative bg-white min-h-screen py-16">
      {/* 1. HERO SECTION */}
      <ProjectDetailHero
        title={project.title}
        location={project.location}
        afterImg={project.afterImg}
        renovationType={project.renovationType}
        timelineLabel={project.timelineLabel}
        highlights={project.highlights}
      />

      {/* 2. PDF DOWNLOAD CTA (Specific Project Context) */}
      {/* <section className="bg-orange-50/30 py-8 px-4 flex justify-center border-y border-orange-100">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-black text-[#090F1A]">Get the detailed Specs in PDF</h2>
            <p className="text-xs text-gray-500 font-medium">Download the full material list & cost breakup for this project.</p>
          </div>
          <PortfolioGenerator projects={[project]} />
        </div>
      </section> */}

      {/* 3. VISUAL SHOWCASE */}
      <VisualShowcase
        gallery={project.gallery}
        beforeImg={project.beforeImg}
        afterImg={project.afterImg}
        videoUrl={project.videoUrl}
        title={project.title}
      />

      {/* 4. PROJECT SPECS (COST/MATERIALS/TIMELINE) */}
      <ProjectSpecs
        costRange={project.costRange}
        costBreakdown={project.costBreakdown}
        materialSpecList={project.materialSpecList}
        milestones={project.milestones}
        timelineLabel={project.timelineLabel}
      />

      {/* 5. SOCIAL PROOF (TESTIMONIAL/RENDERS) */}
      <ProjectSocialProof
        testimonial={project.testimonial}
        designReference={project.designReference}
      />

      {/* 6. FINAL FOOTER & STICKY CTA */}
      <PortfolioFooter />
      {/* <StickyCTA /> */}
    </main>
  );
}
