import ItemContainer from '@/app/components/ui/containers/ItemList';
import type { ReviewDatabase } from '../types';
import type { User } from '@supabase/supabase-js';
import UserAvatar from '@/app/components/ui/UserAvatar';

interface ReviewItemProps {
  data: ReviewDatabase;
  user: User | null;
  onDelete: (reviewId: string) => void;
}

export default function ReviewItem({ data, user, onDelete }: ReviewItemProps) {
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
