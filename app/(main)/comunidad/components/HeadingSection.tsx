export default function HeadingSection({ text }: { text: string }) {
  return (
    <h2 className="border-border-secondary text-md text-border mb-4 flex-shrink-0 border-b-2 uppercase">
      {text}
    </h2>
  );
}
