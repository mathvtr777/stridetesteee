import { Icon } from '@/components/ui/Icon';
import { supabase, RiskReport, RiskComment } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Toaster, toast } from 'sonner';

export default function RiskIntel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState<RiskReport | null>(null);
    const [comments, setComments] = useState<RiskComment[]>([]);
    const [reliability, setReliability] = useState(70);

    useEffect(() => {
        if (!id) return;

        // Fetch Report
        const fetchReport = async () => {
            const { data, error } = await supabase.from('risk_reports').select('*').eq('id', id).single();
            if (data) {
                setReport(data as RiskReport);
                // Calculate Reliability Score
                const daysSince = (Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24);
                const score = Math.min(100, Math.max(0, 70 + (data.upvotes - data.downvotes) * 8 - daysSince * 2));
                setReliability(Math.round(score));
            }
        };

        // Fetch Comments
        const fetchComments = async () => {
            const { data } = await supabase.from('risk_comments').select('*').eq('report_id', id).order('created_at', { ascending: false });
            if (data) setComments(data as RiskComment[]);
        };

        fetchReport();
        fetchComments();
    }, [id]);

    const handleVote = async (voteValue: 1 | -1) => {
        if (!id) return;
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Você deve estar logado para votar");
            return;
        }

        const { error } = await supabase.rpc('vote_risk', {
            report_id_param: id,
            vote_value: voteValue
        });

        if (error) {
            toast.error('Falha ao votar');
            console.error(error);
        } else {
            toast.success('Voto registrado');
            // Update local state optmistically or refetch
            setReport(prev => prev ? {
                ...prev,
                upvotes: voteValue === 1 ? prev.upvotes + 1 : prev.upvotes,
                downvotes: voteValue === -1 ? prev.downvotes + 1 : prev.downvotes
            } : null);
        }
    };

    const handleResolve = async () => {
        if (!id) return;
        const { error } = await supabase.from('risk_reports').update({ status: 'resolved' }).eq('id', id);
        if (error) toast.error('Falha ao resolver');
        else {
            toast.success('Risco marcado como resolvido');
            navigate('/safety');
        }
    };

    const riskTypeLabels: { [key: string]: string } = {
        'theft': 'ROUBO',
        'lighting': 'ILUMINAÇÃO',
        'road': 'ESTRADA',
        'animal': 'ANIMAL',
        'obstacle': 'OBSTÁCULO',
        'other': 'OUTRO'
    };

    if (!report) return <div className="p-8 text-center text-white">Carregando Detalhes...</div>;

    return (
        <div className="relative mx-auto flex h-screen w-full flex-col overflow-hidden bg-background-dark text-white font-display">
            <Toaster />

            {/* TopAppBar */}
            <header className="sticky top-0 z-50 flex items-center bg-background-dark/80 backdrop-blur-md px-6 py-4 justify-between border-b border-white/5">
                <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <Icon name="arrow_back_ios_new" className="text-white" />
                </button>
                <h2 className="text-white text-sm font-bold uppercase tracking-[0.2em] flex-1 text-center">Detalhes do Risco</h2>
                <div className="flex w-10 items-center justify-end">
                    <button className="flex size-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <Icon name="share" className="text-white" />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* Risk Title Section */}
                <div className="p-6">
                    <div className="flex flex-col gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                            {/* Fallback image or a generic map snippet based on coordinates could go here */}
                            <div className="relative aspect-[16/9] w-full rounded-xl bg-secondary/20 flex items-center justify-center border border-white/10 overflow-hidden">
                                <span className="material-symbols-outlined text-6xl text-white/20">map</span>
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    {report.severity >= 4 && <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-primary/20">Crítico</span>}
                                    {reliability >= 85 && <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10">Verificado</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase italic">{riskTypeLabels[report.risk_type]}</h1>
                            <div className="flex items-center gap-2 text-primary">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Icon key={star} name="star" className={`text-[18px] ${star <= report.severity ? 'text-primary fill-current' : 'text-gray-600'}`} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold tracking-widest uppercase opacity-70 ml-1">{report.severity}.0 Severidade</span>
                            </div>
                            <p className="text-[#ab9db8] text-sm font-medium mt-1 flex items-center gap-1">
                                <Icon name="location_on" className="text-xs" />
                                Reportado {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: ptBR })}
                            </p>
                            {report.description && (
                                <p className="text-white/80 text-sm mt-2 italic">"{report.description}"</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reliability Gauge Section */}
                <div className="px-6 py-4">
                    <div className="glass rounded-xl p-6 flex items-center justify-between gap-6 bg-white/5 border border-white/10">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-white text-xs font-bold uppercase tracking-widest opacity-60">Confiabilidade</h3>
                            <p className="text-2xl font-black text-white">{reliability}% <span className="text-xs font-medium text-primary uppercase ml-1">{reliability > 80 ? 'Alta Conf.' : 'Média Conf.'}</span></p>
                            <p className="text-[#ab9db8] text-xs font-normal leading-tight mt-1">Baseado em votos e tempo</p>
                        </div>
                        <div className="relative flex items-center justify-center">
                            <div className="size-20 rounded-full bg-gradient-to-tr from-primary to-transparent p-1.5 flex items-center justify-center">
                                <div className="size-full rounded-full bg-background-dark flex items-center justify-center">
                                    <Icon name="verified" className="text-primary text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Community Reports Section */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em]">Intel da Comunidade</h3>
                    <span className="text-primary text-[10px] font-bold uppercase">{comments.length} Comentários</span>
                </div>

                <div className="px-6 space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="glass rounded-xl p-4 flex flex-col gap-2 border border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-primary tracking-wider uppercase italic">Usuário</span>
                                <span className="text-[10px] text-white/40">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}</span>
                            </div>
                            <p className="text-sm text-white/90 leading-relaxed font-normal">{comment.content}</p>
                        </div>
                    ))}
                    {comments.length === 0 && <p className="text-white/40 text-sm text-center py-4">Sem comentários ainda.</p>}
                </div>
            </main>

            {/* Persistent Action Bar */}
            <footer className="fixed bottom-0 z-50 w-full max-w-[480px] bg-background-dark/95 backdrop-blur-xl border-t border-white/10 px-6 py-6 pb-10">
                <div className="flex gap-3 h-14">
                    {/* Vote Controls */}
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => handleVote(1)}
                            className="flex flex-col items-center justify-center px-4 rounded-xl glass bg-white/5 border border-white/10 text-white hover:text-primary transition-all active:scale-95 group"
                        >
                            <Icon name="thumb_up" className="text-[20px] group-hover:fill-current" />
                            <span className="text-[9px] font-bold uppercase tracking-tighter mt-1">{report.upvotes}</span>
                        </button>
                        <button
                            onClick={() => handleVote(-1)}
                            className="flex flex-col items-center justify-center px-4 rounded-xl glass bg-white/5 border border-white/10 text-white hover:text-red-400 transition-all active:scale-95 group"
                        >
                            <Icon name="thumb_down" className="text-[20px] group-hover:fill-current" />
                            <span className="text-[9px] font-bold uppercase tracking-tighter mt-1">{report.downvotes}</span>
                        </button>
                    </div>

                    {/* Main Actions */}
                    <button
                        onClick={() => handleVote(1)}
                        className="flex-1 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(140,48,232,0.3)] active:scale-[0.98] transition-all"
                    >
                        Confirmar Risco
                    </button>
                </div>

                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleResolve}
                        className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] border-b border-primary/30 pb-0.5 opacity-80 hover:opacity-100 transition-opacity"
                    >
                        Marcar como Resolvido
                    </button>
                </div>
            </footer>
        </div>
    );
}
