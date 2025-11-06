interface Stat {
  label: string;
  value: string | number;
}
interface Props {
  data: Stat[];
}
export default function DetailsBar({ data }: Props) {
  return (
    <div className="gap-md bg-background border-border mb-md flex justify-around p-2">
      {data.map((stat, index) => (
        <p
          key={index}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <span className="font-heading text-light-secondary text-center text-2xl uppercase">
            {stat.label}
          </span>
          <span className="font-heading neon-effect text-light-secondary text-4xl uppercase">
            {stat.value}
          </span>
        </p>
      ))}
    </div>
  );
}
