import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type RouterContextValue = {
  path: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

function getPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash) return hash;
  const path = window.location.pathname;
  return path || '/';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(getPath());

  useEffect(() => {
    const onLocationChange = () => {
      setPath(getPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

export function Link({
  to,
  children,
  className,
  onClick,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { navigate } = useRouter();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
