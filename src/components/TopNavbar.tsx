import React from 'react';
import { FileSpreadsheet, Download, Sparkles } from 'lucide-react';

interface TopNavbarProps {
  onOpenCloudExcel: () => void;
  onExportCsv: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenCloudExcel,
  onExportCsv,
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Sleek logo badge + Voice2Vault + subtle pill Gemma 4 Multimodal */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm ring-1 ring-slate-800/10">
            V2V
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-semibold text-base sm:text-lg text-slate-900 tracking-tight">
              Voice2Vault
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Gemma 4 Multimodal
            </span>
          </div>
        </div>

        {/* Right: 📊 Live Cloud Excel + 📥 Export CSV */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCloudExcel}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
            title="Open Master Spreadsheet preview"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">📊 Live Cloud Excel</span>
            <span className="sm:hidden">Excel</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
            title="Download UTF-8 CSV register for Excel"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">📥 Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
