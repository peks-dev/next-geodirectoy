import { useContributionStore } from '../../../store/useContributionStore';
import ClubCategoriesStep from './ClubCategoriesStep';
import PickupAgeGroupStep from './PickupAgeGroupStep';
import NoTypeSelectedStep from './NoTypeSelectedStep';

export default function ConditionalStep() {
  const { type } = useContributionStore();

  switch (type) {
    case 'club':
      return <ClubCategoriesStep />;

    case 'pickup':
      return <PickupAgeGroupStep />;

    default:
      return <NoTypeSelectedStep />;
  }
}
