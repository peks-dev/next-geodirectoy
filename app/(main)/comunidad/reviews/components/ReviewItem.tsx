import { memo } from 'react';
import ItemContainer from '@/app/components/ui/containers/ItemList';
import type { ReviewDatabase } from '../types';
import type { User } from '@supabase/supabase-js';
import UserAvatar from '@/app/(main)/perfil/components/UserAvatar';

interface ReviewItemProps {
  data: ReviewDatabase;
  user: User | null;
  onDelete: (reviewId: string) => void;
}

function ReviewItem({ data, user, onDelete }: ReviewItemProps) {
  const isOwner = user && data.user_id === user.id;
  return (
    <ItemContainer
      deleteFn={isOwner ? () => onDelete(data.id) : undefined}
      key={data.id}
    >
      <div className="gap-md flex">
        <UserAvatar avatarUrl={data.profiles.avatar_url} size="md" />
        <div>
          <h3 className="text-md uppercase">{data.profiles.name}</h3>
          <p className="text-base">{data.comment}</p>
        </div>
      </div>
    </ItemContainer>
  );
}

export default memo(ReviewItem, (prevProps, nextProps) => {
  // Retorna true si las props son iguales (NO re-renderizar)
  return (
    prevProps.data.id === nextProps.data.id &&
    prevProps.data.comment === nextProps.data.comment &&
    prevProps.data.profiles.name === nextProps.data.profiles.name &&
    prevProps.data.profiles.avatar_url === nextProps.data.profiles.avatar_url &&
    prevProps.user?.id === nextProps.user?.id
    // onDelete lo omitimos porque siempre es una nueva función
  );
});
