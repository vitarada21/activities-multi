type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="text-sm uppercase tracking-[0.3em] font-medium text-foreground/60 mb-3">
          Strava Visualizer
        </div>
        <h1 className="text-accent font-black tracking-tighter leading-[0.9] text-6xl sm:text-7xl mb-8">
          AKTIVITY
        </h1>
        <p className="text-foreground/70 mb-10">
          Vizualizace tvých aktivit ze Stravy. Žádná databáze, jen tvoje data —
          přečtená přímo z API a zobrazená.
        </p>

        <a
          href="/api/auth/login"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#FC4C02] hover:bg-[#e54402] text-white font-semibold uppercase tracking-wider rounded-lg transition-colors"
        >
          Přihlásit přes Stravu
        </a>

        {error && (
          <div className="mt-6 text-sm text-red-600">
            Chyba přihlášení: {error}
          </div>
        )}

        <p className="mt-10 text-xs text-foreground/50">
          Po přihlášení tato aplikace získá oprávnění číst tvoje aktivity.
          Nikam je neukládá, jen zobrazuje. Odhlásíš se kdykoli.
        </p>
      </div>
    </main>
  );
}
