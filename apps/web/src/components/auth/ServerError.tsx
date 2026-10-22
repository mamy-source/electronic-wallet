export function ServerError({ message }: { message?: string | null }) {
    if (!message) return null;
    return (
      <div
        role="alert"
        className="p-3 rounded-lg bg-error-container text-on-error-container type-body-sm flex items-start gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">error</span>
        <span>{message}</span>
      </div>
    );
  }