import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Icon } from "../ui/Icon";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(!!session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (session === null) {
        // Loading state
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-dark text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary flex items-center justify-center animate-pulse">
                        <Icon name="bolt" className="text-white text-3xl" />
                    </div>
                    <p className="text-white/50 text-sm font-bold uppercase tracking-widest animate-pulse">Carregando Stride...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
