export function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      .font-inter {
        font-family: 'Inter', sans-serif;
      }
      @keyframes slide-in {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
      .animate-fade-in {
        animation: fade-in 0.2s ease-out;
      }
    `}</style>
  );
}
