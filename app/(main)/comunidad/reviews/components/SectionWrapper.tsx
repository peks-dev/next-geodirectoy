interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function SectionWrapper({ className, children }: Props) {
  return (
    <section className={`gap-md flex h-full w-full flex-col ${className}`}>
      {children}
    </section>
  );
}
