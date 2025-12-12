'use client';

import HeadingSection from '@/app/(main)/comunidad/components/HeadingSection';
import Button from '@/app/components/ui/Button';
import DetailsBar from '@/app/components/ui/DetailsBar';
import ReviewItem from './ReviewItem';
import SectionWrapper from './SectionWrapper';
import { useReviews } from '../hooks/useReviews';

interface Props {
  average_rating: number;
  total_reviews: number;
  community_id: string;
}

export default function ReviewsSection({
  average_rating: initialAverageRating,
  total_reviews: initialTotalReviews,
  community_id,
}: Props) {
  const {
    reviews,
    isLoading,
    error,
    totalReviews,
    averageRating,
    handleCommunityRating,
    handleDeleteReview,
    fetchReviews,
    userLogged,
  } = useReviews({
    communityId: community_id,
    initialAverageRating,
    initialTotalReviews,
  });

  // Renderizado condicional del contenido
  const renderContent = () => {
    if (error) {
      return (
        <div className="py-8 text-center">
          <p className="mb-2 text-red-500">{error}</p>
          <Button onClick={fetchReviews} variant="secondary">
            reintentar
          </Button>
        </div>
      );
    }
    if (isLoading)
      return <p className="py-8 text-center">cargando comentarios...</p>;
    if (reviews.length === 0) {
      return (
        <p className="py-8 text-center text-gray-500">
          aún no hay comentarios. ¡sé el primero en valorar!
        </p>
      );
    }
    return reviews.map((review) => (
      <ReviewItem
        key={review.id}
        user={userLogged}
        data={review}
        onDelete={() => handleDeleteReview(review.id)}
      />
    ));
  };

  return (
    <SectionWrapper>
      <HeadingSection text="comentarios">
        <Button className="w-min" onClick={handleCommunityRating}>
          valorar
        </Button>
      </HeadingSection>
      <DetailsBar
        data={[
          { label: 'cantidad', value: totalReviews },
          { label: 'valoración promedio', value: averageRating },
        ]}
      />
      <ul className="gap-md flex grow flex-col overflow-auto pb-4">
        {renderContent()}
      </ul>
    </SectionWrapper>
  );
}
