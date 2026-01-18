import { Icon } from '@/components/ui/Icon';
import { supabase, RiskSeverity } from '@/lib/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';

export default function ReportRisk() {
    const navigate = useNavigate();
    const [severity, setSeverity] = useState<RiskSeverity>(3);
    const [riskType, setRiskType] = useState<string | null>(null);
    const [occurrenceTime, setOccurrenceTime] = useState<'day' | 'night' | 'always'>('always');
    const { register, handleSubmit } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock location for now (would be passed from query param or useGeolocation)
    const currentLat = 40.785091;
    const currentLng = -73.968285;

    const onSubmit = async (data: any) => {
        if (!riskType) {
            toast.error('Por favor selecione um tipo de risco');
            return;
        }

        setIsSubmitting(true);

        // Check auth
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('risk_reports').insert({
            user_id: user?.id || '00000000-0000-0000-0000-000000000000',
            lat: currentLat,
            lng: currentLng,
            risk_type: riskType,
            severity,
            occurrence_time: occurrenceTime,
            description: data.description,
            status: 'active'
        });

        setIsSubmitting(false);

        if (error) {
            console.error(error);
            toast.error('Falha ao enviar. Verifique se está logado.');
        } else {
            toast.success('Risco reportado com sucesso');
            setTimeout(() => navigate('/safety'), 1500);
        }
    };

    const riskTypeLabels: { [key: string]: string } = {
        'theft': 'Roubo',
        'lighting': 'Iluminação',
        'road': 'Estrada',
        'animal': 'Animal',
        'obstacle': 'Obstáculo',
        'other': 'Outro'
    };

    const timeLabels: { [key: string]: string } = {
        'day': 'Dia',
        'night': 'Noite',
        'always': 'Sempre'
    };

    return (
        <div className="relative mx-auto flex h-screen w-full flex-col overflow-hidden bg-background-dark text-white font-display">
            <Toaster />
            {/* Header */}
            <header className="flex items-center justify-between px-6 pt-8 pb-4">
                <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-start hover:text-white/80">
                    <Icon name="close" className="text-white/70" />
                </button>
                <h1 className="text-xl font-bold tracking-tight text-white">Reportar Risco</h1>
                <div className="flex size-10 items-center justify-end">
                    <Icon name="info" className="text-white/70" />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-8 pb-32">
                {/* Risk Type Grid */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50">Tipo de Risco</h3>
                        <span className="text-xs text-primary font-medium">Obrigatório</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {['theft', 'lighting', 'road', 'animal', 'obstacle', 'other'].map(type => (
                            <button
                                key={type}
                                onClick={() => setRiskType(type)}
                                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all ${riskType === type ? 'border-primary bg-primary/20 ring-1 ring-primary/50' : 'border-white/10 bg-secondary/40 hover:bg-secondary/60'}`}
                            >
                                <Icon name={getIconForType(type)} className={riskType === type ? 'text-white' : 'text-white/60'} />
                                <span className={`text-[11px] font-bold uppercase tracking-tighter ${riskType === type ? 'text-white' : 'text-white/60'}`}>{riskTypeLabels[type]}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Severity Slider */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50">Severidade</h3>
                        <span className="text-lg font-bold text-accent">Nível {severity}</span>
                    </div>
                    <div className="relative px-2 py-4">
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={severity}
                            onChange={(e) => setSeverity(Number(e.target.value) as RiskSeverity)}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-2 px-1">
                            <span className="text-[10px] font-bold text-white/30 uppercase">Leve</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase">Crítico</span>
                        </div>
                    </div>
                </section>

                {/* Temporal Context */}
                <section>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/50">Horário da Ocorrência</h3>
                    <div className="flex gap-3">
                        {['day', 'night', 'always'].map((time) => (
                            <button
                                key={time}
                                onClick={() => setOccurrenceTime(time as any)}
                                className={`flex-1 rounded-full py-2.5 px-4 text-sm font-medium transition-colors ${occurrenceTime === time ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold' : 'glass text-white/70 hover:bg-white/10'}`}
                            >
                                {timeLabels[time]}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Narrative Input */}
                <section>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/50">Detalhes (Opcional)</h3>
                    <textarea
                        {...register('description')}
                        className="w-full glass rounded-xl p-4 text-sm text-white placeholder:text-white/30 bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary/50"
                        placeholder="Descreva o perigo (ex: poste apagado perto da entrada...)"
                        rows={3}
                    ></textarea>
                </section>
            </main>

            {/* Footer */}
            <footer className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-background-dark/80 backdrop-blur-xl px-6 pt-4 pb-8 space-y-4">
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-white shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                    <span>{isSubmitting ? 'Enviando...' : 'Confirmar Posição'}</span>
                    <Icon name="chevron_right" className="text-lg" />
                </button>
            </footer>
        </div>
    );
}

function getIconForType(type: string) {
    switch (type) {
        case 'theft': return 'shield';
        case 'lighting': return 'lightbulb';
        case 'road': return 'construction';
        case 'animal': return 'pets';
        case 'obstacle': return 'warning';
        default: return 'more_horiz';
    }
}
