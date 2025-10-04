// steps
import TypeStep from './steps/TypeStep';
import BasicInfoStep from './steps/BasicInfoStep';
import LocationStep from './steps/LocationStep';
import ImageStep from './steps/ImagesStep/index';
import ScheduleStep from './steps/ScheduleStep/index';
import ServiceStep from './steps/ServicesStep';
import ConditionalStep from './steps/ConditionalStep/index';

interface StepRendererProps {
  currentStep: number;
}

const StepRenderer: React.FC<StepRendererProps> = ({ currentStep }) => {
  switch (currentStep) {
    case 1:
      return <TypeStep />;
    case 2:
      return <BasicInfoStep />;
    case 3:
      return <LocationStep />;
    case 4:
      return <ImageStep />;
    case 5:
      return <ScheduleStep />;
    case 6:
      return <ServiceStep />;
    case 7:
      return <ConditionalStep />;
    default:
      return null;
  }
};

export default StepRenderer;
