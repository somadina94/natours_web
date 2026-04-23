import { notFound } from "next/navigation";
import { getTourBySlug } from "@/lib/api/tours";
import { buildMetadata } from "@/lib/metadata";
import { TourDetailView } from "@/components/organisms/tour-detail-view";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug).catch(() => null);
  if (!tour) {
    return buildMetadata({
      title: "Tour not found",
      description: "We could not find that tour.",
      path: `/tours/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: tour.name,
    description: tour.summary,
    path: `/tours/${tour.slug}`,
    keywords: [tour.name, tour.difficulty, "Natours tour", "outdoor adventure"],
  });
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug).catch(() => null);
  if (!tour) notFound();
  return <TourDetailView tour={tour} />;
}
