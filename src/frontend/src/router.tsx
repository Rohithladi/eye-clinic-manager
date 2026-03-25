import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type RouterContextType = {
  path: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterContextType>({
  path: "/",
  navigate: () => {},
});

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function useNavigate() {
  return useContext(RouterContext).navigate;
}

export function useParams<T extends Record<string, string>>(
  pattern: string,
): T | null {
  const { path } = useRouter();
  return matchRoute(pattern, path) as T | null;
}

function matchRoute(
  pattern: string,
  path: string,
): Record<string, string> | null {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

type RouteProps = {
  path: string;
  children: ReactNode | ((params: Record<string, string>) => ReactNode);
};

export function Route({ path, children }: RouteProps) {
  const { path: currentPath } = useRouter();
  const params = matchRoute(path, currentPath);
  if (params === null) return null;
  if (typeof children === "function") return <>{children(params)}</>;
  return <>{children}</>;
}

export function Link({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const { navigate } = useRouter();
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}
