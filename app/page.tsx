export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <div className="bg-background">Fondo principal</div>
      <div className="bg-background-secondary">Fondo secundario</div>
      <div className="bg-background-accent">Fondo de acento</div>

      <p className="text-foreground">Texto principal (Barlow)</p>
      <p className="text-foreground-secondary">Texto secundario</p>

      <div className="border-border border">Con borde</div>
      <button className="border-border-interactive border-2">
        Borde interactivo
      </button>

      <h1>Título con Iceland</h1>
      <button className="btn-primary">primario</button>
    </div>
  );
}
