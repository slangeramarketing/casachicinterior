"use client";

import { useParams, notFound } from "next/navigation";
import { projects } from "@/lib/data/projects/projects";
import * as Fi from "react-icons/fi";
import ProjectGallery from "@/components/public/ProjectGallery";
import Link from "next/link";
import { PageRouteHeader } from "@/components/common/PageHeader";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const project = projects.find(p => p.slug === slug);
  if (!project) notFound();

  return (
    <section className="max-w-7xl mx-auto px-6 py-32 space-y-24">

      {/* HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 ">
        <ProjectGallery
          images={[project.coverImage, ...project.galleryImages]}
        />

        <div className="space-y-6">
          {/* <p className="text-sm text-gray-500 mb-3">
            <Link href="/services" className="hover:underline">
              Services
            </Link>{" "}
            / {project.slug}
          </p> */}
          <PageRouteHeader/>

          <h1 className="text-4xl font-bold text-gray-900">
            {project.title}
          </h1>

          <p className="text-gray-600">
            {project.shortDescription}
          </p>

          <div className="grid grid-cols-2 gap-5 text-sm">
            <Info label="Project Location" value={project.location} />
            <Info label="Project Category" value={project.category} />
            <Info label="Project Timeline" value={project.duration} />
            <Info label="Project Status" value={project.status} />
            <Info label="Execution Model" value={project.executionModel} />
            <Info label="Quality Assurance" value={project.qualityAssurance} />
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      <Section title="Overview">
        <p className="text-gray-600 leading-relaxed max-w-3xl pb-4 text-sm">
          {project.overview}
        </p>
      </Section>

      {/* MATERIALS */}
      <Section title="Materials Used">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {project.materials.map((item, i) => {
            const Icon = Fi[item.icon as keyof typeof Fi];
            return (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <Icon className="text-orange-500 mt-1" />
                <span>{item.text}</span>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* WORKFORCE */}
      <Section title="Workforce & Execution">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          {project.workforce.map((item, i) => {
            const Icon = Fi[item.icon as keyof typeof Fi];
            return (
              <li key={i} className="flex items-start gap-3">
                <Icon className="text-orange-500 mt-1" />
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.value}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

    </section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}
