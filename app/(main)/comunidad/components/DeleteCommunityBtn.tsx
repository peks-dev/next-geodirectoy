'use client';

import Button from '@/app/components/ui/Button';
import { DeleteIcon } from '@/app/components/ui/svgs';
import { useModalStore } from '@/app/components/ui/Modal';
import { deleteCommunity } from '../action/delete-community';
import { useCommunitiesProfileStore } from '../../perfil/stores/useCommunitiesProfileStore';
import { showErrorToast, showSuccessToast } from '@/shared/notifications';

export default function DeleteCommunityBtn({
  communityId,
}: {
  communityId: string;
}) {
  const { openModal } = useModalStore();
  const removeCommunity = useCommunitiesProfileStore(
    (state) => state.removeCommunity
  );

  const handleDeleteCommunity = () => {
    openModal({
      title: '¿eliminar comunidad?',
      content: 'esta acción es irreversible y permanente',
      confirmButton: {
        text: 'eliminar',
        variant: 'delete',
        onClick: async () => {
          const result = await deleteCommunity(communityId);
          if (!result.success) {
            showErrorToast('algo salio mal', result.error.message);
          } else {
            removeCommunity(communityId);
            showSuccessToast(
              'eliminacion exitosa',
              `comunidad ${result.data.name} eliminada `
            );
          }
        },
      },
    });
  };
  return (
    <Button
      variant="icon"
      className="bg-border-secondary p-4"
      onClick={handleDeleteCommunity}
      size="small"
    >
      <DeleteIcon />
    </Button>
  );
}
