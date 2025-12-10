'use client';

import Button from '@/app/components/ui/Button';
import ShareIcon from '@/app/components/ui/svgs/ShareIcon';
import { useShare } from '@/lib/hooks/useShare';

// ==================== Types ====================
interface ShareButtonProps {
  name: string;
  description: string;
}

// ==================== Component ====================
export default function ShareButton({ name, description }: ShareButtonProps) {
  const { handleShare } = useShare();

  return (
    <Button
      onClick={() => handleShare({ title: name, text: description })}
      id="share-button"
      variant="icon"
      size="md"
      aria-label="Compartir contenido"
    >
      <ShareIcon />
    </Button>
  );
}
