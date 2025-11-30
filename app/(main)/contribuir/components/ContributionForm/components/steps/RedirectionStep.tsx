import { SuccessIcon } from '@/app/components/ui/svgs';

export default function RedirectionStep() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10">
      <figure className="text-success neon-effect h-[15rem] w-[15rem]">
        <SuccessIcon />
      </figure>
      <p className="text-md font-oxanium mb-xl text-center">
        redirigiendo a comunidad
      </p>
    </div>
  );
}
