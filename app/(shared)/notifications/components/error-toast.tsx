import type { FieldError } from '../types';

interface ErrorToastProps {
  errors: FieldError[];
}

export default function ErrorToast({ errors }: ErrorToastProps) {
  if (errors.length === 1) {
    const error = errors[0];
    return (
      <div className="flex flex-col gap-3">
        <p>Error de validación</p>
        <p>
          {error.field ? (
            <>
              <span>{error.field}</span>: {error.message}
            </>
          ) : (
            error.message
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-heading text-md">
        {errors.length} errores encontrados
      </p>
      <ul className="space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="flex items-start gap-1 text-sm">
            <span className="text-error font-bold">•</span>
            <span>
              {error.field ? (
                <>
                  <span className="text-error font-medium">{error.field}</span>:{' '}
                  {error.message}
                </>
              ) : (
                error.message
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
