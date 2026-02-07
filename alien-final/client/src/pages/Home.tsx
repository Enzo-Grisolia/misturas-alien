import { useState } from 'react';
import { Fuel } from 'lucide-react';

/**
 * Alien Motorsport - Fuel Mixture Calculator 2026
 * 
 * Design Philosophy: Elegant Minimalism
 * - Clean black and white color scheme
 * - Professional and sophisticated aesthetic
 * - Brand-aligned with Alien Motorsport identity
 * - Subtle shadows and refined typography
 */

interface CalculationResult {
  gasoline: number;
  ethanol: number;
  total: number;
  type: string;
  gasolineType: string;
}

export default function Home() {
  const [mixtureType, setMixtureType] = useState('E80');
  const [liters, setLiters] = useState('');
  const [gasolineType, setGasolineType] = useState('Premium');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateMixture = () => {
    const quantityTotal = parseFloat(liters) || 0;
    if (quantityTotal <= 0) {
      alert('Por favor, insira uma quantidade válida de litros');
      return;
    }

    setIsCalculating(true);
    
    setTimeout(() => {
      const percentualEtanolNaGasolina = gasolineType === 'Premium' ? 0.25 : 0.30;

      const proporcoes: Record<string, number> = {
        E40: 0.4,
        E50: 0.5,
        E63: 0.63,
        E70: 0.7,
        E75: 0.75,
        E80: 0.8,
        E85: 0.85,
      };

      const percentualEtanolDesejado = proporcoes[mixtureType];

      let gasolinaNecessaria =
        (quantityTotal * (1 - percentualEtanolDesejado)) /
        (1 - percentualEtanolNaGasolina);
      let etanolNecessario = quantityTotal - gasolinaNecessaria;

      gasolinaNecessaria = Math.round(gasolinaNecessaria);
      etanolNecessario = Math.round(etanolNecessario);

      let totalCalculado = gasolinaNecessaria + etanolNecessario;
      if (totalCalculado < quantityTotal) {
        if (gasolinaNecessaria > etanolNecessario) {
          gasolinaNecessaria++;
        } else {
          etanolNecessario++;
        }
      }

      setResult({
        gasoline: gasolinaNecessaria,
        ethanol: etanolNecessario,
        total: quantityTotal,
        type: mixtureType,
        gasolineType: gasolineType,
      });

      setIsCalculating(false);
    }, 400);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculateMixture();
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        backgroundImage: 'url(https://files.manuscdn.com/user_upload_by_module/session_file/310519663339608562/iUWKAjBWMVLFVwaR.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header with logo */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black mb-2 text-white tracking-tight">
            ALIEN
          </h1>
          <h2 className="text-2xl font-light text-white/90 tracking-widest">
            MOTORSPORT
          </h2>
          <p className="text-sm mt-3 text-white/70 tracking-wider">
            FUEL MIXTURE CALCULATOR 2026
          </p>
        </div>

        {/* Calculator card */}
        <div className="elegant-card rounded-lg p-8 mb-8">
          <div className="space-y-6">
            {/* Mixture Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 tracking-wide">
                TIPO DE MISTURA
              </label>
              <select
                value={mixtureType}
                onChange={(e) => setMixtureType(e.target.value)}
                className="elegant-select w-full rounded"
              >
                <option value="E40">E40 (40% Etanol)</option>
                <option value="E50">E50 (50% Etanol)</option>
                <option value="E63">E63 (63% Etanol)</option>
                <option value="E70">E70 (70% Etanol)</option>
                <option value="E75">E75 (75% Etanol)</option>
                <option value="E80">E80 (80% Etanol)</option>
                <option value="E85">E85 (85% Etanol)</option>
              </select>
            </div>

            {/* Liters input */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 tracking-wide">
                QUANTIDADE (LITROS)
              </label>
              <div className="flex items-center gap-2">
                <Fuel size={20} className="text-gray-600" />
                <input
                  type="number"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="0.0"
                  min="0"
                  step="0.1"
                  className="elegant-input flex-1 rounded"
                />
              </div>
            </div>

            {/* Gasoline type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 tracking-wide">
                TIPO DE GASOLINA
              </label>
              <select
                value={gasolineType}
                onChange={(e) => setGasolineType(e.target.value)}
                className="elegant-select w-full rounded"
              >
                <option value="Premium">Premium (25% Etanol)</option>
                <option value="Comum">Comum (30% Etanol)</option>
              </select>
            </div>

            {/* Calculate button */}
            <button
              onClick={calculateMixture}
              disabled={isCalculating}
              className="elegant-button w-full mt-8 rounded disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  CALCULANDO...
                </span>
              ) : (
                'CALCULAR MISTURA'
              )}
            </button>
          </div>
        </div>

        {/* Result display */}
        {result && (
          <div className="animate-in fade-in duration-500">
            <div className="elegant-card rounded-lg p-5">
              <h3 className="text-sm font-bold mb-3 text-center tracking-wide text-gray-900">
                RESULTADO {result.type}
              </h3>

              <div className="space-y-2">
                {/* Gasoline result */}
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 tracking-widest">
                    GASOLINA {result.gasolineType === 'Premium' ? 'PREMIUM' : 'COMUM'}
                  </span>
                  <span className="text-lg font-black text-gray-900">
                    {result.gasoline}L
                  </span>
                </div>

                {/* Ethanol result */}
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 tracking-widest">
                    ETANOL
                  </span>
                  <span className="text-lg font-black text-gray-900">
                    {result.ethanol}L
                  </span>
                </div>

                {/* Total result */}
                <div className="flex items-center justify-between py-2 pt-3">
                  <span className="text-xs font-semibold text-gray-700 tracking-widest">
                    TOTAL
                  </span>
                  <span className="text-lg font-black text-gray-900">
                    {result.total}L
                  </span>
                </div>
              </div>

              {/* Info text */}
              <p className="text-xs mt-3 text-center text-gray-500">
                Mistura calculada com precisão
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-xs text-white/70 border-t border-white/20 backdrop-blur-sm bg-black/30">
        <p className="tracking-wide">
          © 2026 ALIEN MOTORSPORT - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
