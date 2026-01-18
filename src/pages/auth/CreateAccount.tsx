import { Icon } from '@/components/ui/Icon';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

export default function CreateAccount() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        agreed: false
    });

    const handleRegister = async () => {
        if (!formData.agreed) {
            toast.error("Você deve aceitar os termos.");
            return;
        }
        if (!formData.email || !formData.password || !formData.fullName) {
            toast.error("Preencha todos os campos.");
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName
                }
            }
        });

        setLoading(false);

        if (error) {
            console.error(error);
            toast.error(error.message);
        } else {
            toast.success("Conta criada! Verifique seu email.");
            // For UX, maybe auto login or redirect to login? 
            // Supabase auto logs in if email confirmation is disabled, otherwise wait.
            // Assuming default behavior:
            if (data.session) {
                navigate('/');
            } else {
                // Email confirmation case
                toast.info("Verifique seu email para confirmar.");
                navigate('/auth/login');
            }
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto overflow-x-hidden pb-10 bg-background-light dark:bg-background-dark font-display text-white selection:bg-primary/30">
            <Toaster />
            {/* Top App Bar */}
            <div className="flex items-center px-6 py-4 justify-between pt-12">
                <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white transition-colors">
                    <Icon name="arrow_back_ios_new" className="text-[28px]" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                        <Icon name="bolt" className="text-white text-[20px] font-bold" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight">Stride</span>
                </div>
                <div className="w-7"></div>
            </div>

            {/* Headline */}
            <div className="px-8 pt-6 pb-6">
                <h1 className="text-white text-[36px] font-extrabold leading-tight tracking-tight">Entre para o Stride</h1>
                <p className="text-white/60 text-lg font-medium leading-normal mt-2">Comece sua jornada com rastreamento seguro.</p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-5 px-8 mt-4">
                {/* Full Name */}
                <div className="flex flex-col gap-2 group">
                    <label className="text-white/50 text-xs font-bold uppercase tracking-widest px-1">Nome Completo</label>
                    <div className="flex items-center bg-surface-dark border border-white/10 rounded-2xl h-16 px-5 transition-all duration-300 focus-within:shadow-glow focus-within:border-primary">
                        <Icon name="person" className="text-white/40 group-focus-within:text-primary mr-3" />
                        <input
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/30 w-full text-base font-medium focus:outline-none"
                            placeholder="Digite seu nome"
                            type="text"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2 group">
                    <label className="text-white/50 text-xs font-bold uppercase tracking-widest px-1">Email</label>
                    <div className="flex items-center bg-surface-dark border border-white/10 rounded-2xl h-16 px-5 transition-all duration-300 focus-within:shadow-glow focus-within:border-primary">
                        <Icon name="mail" className="text-white/40 group-focus-within:text-primary mr-3" />
                        <input
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/30 w-full text-base font-medium focus:outline-none"
                            placeholder="nome@exemplo.com"
                            type="email"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2 group">
                    <label className="text-white/50 text-xs font-bold uppercase tracking-widest px-1">Senha</label>
                    <div className="flex items-center bg-surface-dark border border-white/10 rounded-2xl h-16 px-5 transition-all duration-300 focus-within:shadow-glow focus-within:border-primary">
                        <Icon name="lock" className="text-white/40 group-focus-within:text-primary mr-3" />
                        <input
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/30 w-full text-base font-medium focus:outline-none"
                            placeholder="••••••••"
                            type="password"
                        />
                    </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 px-1 mt-2">
                    <label className="relative flex items-center cursor-pointer mt-0.5">
                        <input
                            checked={formData.agreed}
                            onChange={e => setFormData({ ...formData, agreed: e.target.checked })}
                            className="peer appearance-none h-6 w-6 border-2 border-white/20 rounded-lg bg-surface-dark checked:bg-primary checked:border-primary transition-all cursor-pointer"
                            type="checkbox"
                        />
                        <Icon name="check" className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity text-[18px] left-[3px] pointer-events-none" />
                    </label>
                    <p className="text-sm text-white/50 leading-snug">
                        Eu concordo com os <a className="text-white underline decoration-primary/50 underline-offset-4" href="#">Termos de Serviço</a> e <a className="text-white underline decoration-primary/50 underline-offset-4" href="#">Política de Privacidade</a>
                    </p>
                </div>
            </div>

            {/* Action Button */}
            <div className="px-8 mt-10">
                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full h-[70px] rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all bg-gradient-to-b from-[#8c30e8] to-[#6B13E0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="text-white text-lg font-bold tracking-wide">{loading ? 'Criando...' : 'Criar Conta'}</span>
                    {!loading && <Icon name="arrow_forward" className="text-white text-[20px]" />}
                </button>
            </div>

            {/* Spacer Map Visual */}
            <div className="mt-12 px-8 flex justify-center">
                <div className="relative w-full h-24 rounded-2xl overflow-hidden grayscale opacity-30 border border-white/5">
                    {/* Simulated Map Background */}
                    <div className="w-full h-full bg-[#202020] flex items-center justify-center">
                        <Icon name="map" className="text-4xl text-white/20" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent"></div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 pb-4 text-center">
                <p className="text-white/40 font-medium text-sm">
                    Já tem uma conta?
                    <Link to="/auth/login" className="text-primary font-bold ml-1 hover:text-accent-purple transition-colors">Entrar</Link>
                </p>
            </div>
        </div>
    );
}
