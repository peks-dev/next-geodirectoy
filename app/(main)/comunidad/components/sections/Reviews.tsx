'use client';
import { useState, useEffect, useCallback } from 'react';
import HeadingSection from '../HeadingSection';
import Button from '@/app/components/ui/Button';
import RatingForm from '../RatingForm';
import DetailsBar from '@/app/components/ui/DetailsBar';
import ReviewItem from '../ReviewItem';
import type {
  DbReviewResponse,
  ReviewFormState,
} from '@/app/types/reviewTypes';
import { useModalStore } from '@/app/components/ui/Modal/useModalStore';
import { useRatingFormStore } from '../RatingForm/useRatingStore';
import { getReviews } from '../../action/getReviews';
import { createReview } from '../../action/createReview';
import { deleteReview } from '../../action/deleteReview';
import { useAuth } from '@/app/(auth)/components/AuthProvider';
import {
  showErrorToast,
  showSuccessToast,
} from '@/app/components/toast/notificationService';
import SectionWrapper from './SectionWrapper';
import { useRouter, usePathname } from 'next/navigation';

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
  const { showConfirmation } = useModalStore();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<DbReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Estados locales para el conteo y promedio de valoraciones
  const [totalReviews, setTotalReviews] = useState(initialTotalReviews);
  const [averageRating, setAverageRating] = useState(initialAverageRating);

  // Obtener valoraciones
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getReviews(community_id);
    if (result.success) {
      setReviews(result.data || []);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  }, [community_id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Modal de confirmación para eliminar valoracion
  const handleDeleteReview = (reviewId: string) => {
    const reviewToDelete = reviews.find((review) => review.id === reviewId);
    if (!reviewToDelete) {
      showErrorToast(
        'Error',
        'No se pudo encontrar el comentario para eliminar.'
      );
      return;
    }

    showConfirmation({
      title: 'eliminar comentario',
      message: '¿quieres eliminar tu comentario? esto no es revertible',
      variant: 'primary',
      confirmText: 'sí, eliminar',
      onConfirm: async () => {
        const result = await deleteReview(reviewId);

        if (result.success) {
          showSuccessToast(
            'Comentario eliminado',
            result.message || 'Tu comentario ha sido eliminado.'
          );
          // Actualiza la UI eliminando la review del estado local
          setReviews((currentReviews) =>
            currentReviews.filter((review) => review.id !== reviewId)
          );

          // Actualiza el estado local de total y promedio
          const newTotal = totalReviews - 1;
          const newAverage =
            newTotal > 0
              ? (averageRating * totalReviews - reviewToDelete.rating) /
                newTotal
              : 0;

          setTotalReviews(newTotal);
          setAverageRating(parseFloat(newAverage.toFixed(2)));
        } else {
          showErrorToast(
            'Error al eliminar',
            result.message || 'No se pudo eliminar el comentario.'
          );
        }
      },
    });
  };

  // Modal de confirmación para crear valoración
  const handleCommunityRating = () => {
    if (!user) {
      showErrorToast(
        'Acción requerida',
        'Debes iniciar sesión para poder valorar la comunidad.'
      );
      // ✅ Redirige a sign-in con la URL actual como returnUrl
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/sign-in?returnUrl=${returnUrl}`);
      return;
    }

    showConfirmation({
      title: 'valorar la comunidad',
      confirmText: 'enviar valoración',
      ContentComponent: RatingForm,
      onConfirm: async () => {
        const { comment, rating }: ReviewFormState =
          useRatingFormStore.getState();

        const result = await createReview({ comment, rating, community_id });

        if (result.success) {
          showSuccessToast(
            'Valoración enviada',
            result.message || '¡Gracias por tu aportación!'
          );

          // Actualizamos el total y promedio localmente para una UX instantánea
          const newTotal = totalReviews + 1;

          const newAverage = (averageRating * totalReviews + rating) / newTotal;

          setTotalReviews(newTotal);
          setAverageRating(parseFloat(newAverage.toFixed(2)));

          // Recargamos las reseñas desde el backend para mostrar la nueva
          await fetchReviews();
        } else {
          showErrorToast(
            'Error al enviar',
            result.message || 'No se pudo enviar tu review, intenta de nuevo.'
          );
        }
      },
    });
  };

  // Renderizado condicional del contenido
  const renderContent = () => {
    if (error) {
      return (
        <div className="py-8 text-center">
          <p className="mb-2 text-red-500">{error}</p>
          <Button onClick={fetchReviews} variant="secondary" size="sm">
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
        data={review}
        user={user}
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
