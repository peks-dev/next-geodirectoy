'use client';
import Button from '@/app/components/ui/Button';
import { DeleteIcon } from '@/app/components/ui/svgs';
import { useModalStore } from '@/app/components/ui/Modal/useModalStore';
import { deleteCommunity } from '../action/delete-community';
import { useCommunitiesProfileStore } from '../../perfil/stores/useCommunitiesProfileStore';
import {
  showErrorToast,
  showSuccessToast,
} from '@/app/components/toast/notificationService';

export default function DeleteCommunityBtn({
  communityId,
}: {
  communityId: string;
}) {
  const { showConfirmation } = useModalStore();
  const removeCommunity = useCommunitiesProfileStore(
    (state) => state.removeCommunity
  );

  const handleDeleteCommunity = () => {
    showConfirmation({
      title: '¿eliminar comunidad?',
      message: 'esta acción es irreversible y permanente',
      confirmText: 'si, eliminar',
      onConfirm: async () => {
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
    });
  };
  return (
    <Button
      variant="icon"
      className="bg-error text-light-primary p-4"
      onClick={handleDeleteCommunity}
    >
      <DeleteIcon />
    </Button>
  );
}
