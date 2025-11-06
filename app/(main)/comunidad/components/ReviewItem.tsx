import ItemContainer from '@/app/components/ui/containers/ItemList';
import type { DbReviewResponse } from '@/app/types/reviewTypes';
import type { User } from '@supabase/supabase-js';
import UserAvatar from '@/app/components/ui/UserAvatar';

interface ReviewItemProps {
  data: DbReviewResponse;
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
          <h3 className="text-4xl uppercase">{data.profiles.name}</h3>
          <p className="text-2xs">{data.comment}</p>
        </div>
      </div>
    </ItemContainer>
  );
}
