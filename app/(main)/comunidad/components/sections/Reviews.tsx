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
import { useAuth } from '@/app/components/auth/AuthProvider';
import {
  showErrorToast,
  showSuccessToast,
} from '@/app/components/toast/notificationService';

interface Props {
  average_rating: number;
  total_reviews: number;
  community_id: string;
}

export default function ReviewsSection({
  average_rating,
  total_reviews,
  community_id,
}: Props) {
  const { showConfirmation } = useModalStore();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<DbReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // 1. Verificar si el usuario está logueado ANTES de mostrar el modal.
    if (!user) {
      showErrorToast(
        'Acción requerida',
        'Debes iniciar sesión para poder valorar la comunidad.'
      );
      return; // Detenemos la ejecución aquí si no hay usuario.
    }

    // 2. Si el usuario existe, procedemos a mostrar el modal.
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
    <div className="flex h-full w-full flex-col">
      <HeadingSection text="comentarios">
        <Button className="w-min" onClick={handleCommunityRating}>
          valorar
        </Button>
      </HeadingSection>
      <DetailsBar
        data={[
          { label: 'cantidad', value: total_reviews },
          { label: 'valoración promedio', value: average_rating },
        ]}
      />
      <div className="grow overflow-auto">{renderContent()}</div>
    </div>
  );
}
