import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Share2,
  FileSpreadsheet,
  Calendar,
  MapPin,
  FileText,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { Voucher } from '../types/voucher';
import { UpiPaymentQr } from './UpiPaymentQr';

interface ForensicVoucherProps {
  voucher: Voucher | null;
  onAppendToRegister: (voucher: Voucher) => void;
  onUpdateVoucher?: (voucher: Voucher) => void;
  isAppended: boolean;
}

export const ForensicVoucher: React.FC<ForensicVoucherProps> = ({
  voucher,
  onAppendToRegister,
  onUpdateVoucher,
  isAppended,
}) => {
  const [smsCopied, setSmsCopied] = useState(false);

  if (!voucher) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] text-center flex flex-col items-center justify-center min-h-[460px]">
        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-3 text-slate-300">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-base text-slate-800">
          No Invoice Generated Yet
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
          Select a preset demo or upload a kachha bill on the left, then click "Run AI Forensic Audit".
        </p>
      </div>
    );
  }

  const formatINR = (val: number) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // WhatsApp intent URL
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(voucher.whatsappParchiText || '')}`;

  // Regional Indian SMS intent
  const smsBody = voucher.hasMathAnomaly
    ? `[VYAPARVAULT] ${voucher.partyName}: Total Bill Rs ${voucher.totalAmount.toLocaleString('en-IN')}, Paid Rs ${voucher.paidAmount.toLocaleString('en-IN')}. ACTUAL Due Udhaar: Rs ${voucher.computedUdhaar.toLocaleString('en-IN')} (Stated Rs ${voucher.statedUdhaar.toLocaleString('en-IN')} - Rs ${Math.abs(voucher.mathDiscrepancy).toLocaleString('en-IN')} error prevented). Due: ${voucher.dueDate}. Indore Mandi.`
    : `[VYAPARVAULT] ${voucher.partyName}: Total Bill Rs ${voucher.totalAmount.toLocaleString('en-IN')}, Paid Rs ${voucher.paidAmount.toLocaleString('en-IN')}. Due Udhaar: Rs ${voucher.computedUdhaar.toLocaleString('en-IN')}. Due: ${voucher.dueDate}. 100% Math Verified. Indore Mandi.`;

  const smsUrl = `sms:?&body=${encodeURIComponent(smsBody)}`;

  const handleSmsClick = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(smsBody).catch(() => {});
      setSmsCopied(true);
      setTimeout(() => setSmsCopied(false), 2500);
    }
  };

  // Credit Risk calculations
  const total = voucher.totalAmount || 1;
  const paid = voucher.paidAmount || 0;
  const udhaar = voucher.computedUdhaar || 0;
  const paidPercent = Math.min(100, Math.max(0, (paid / total) * 100));
  const udhaarPercent = Math.min(100, Math.max(0, (udhaar / total) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-6">
      {/* 1. CLEAN PARTY HEADER WITH LOCATION PILL & DUE-DATE BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
              {voucher.partyName}
            </h3>
            <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
              {voucher.voucherNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60">
              <MapPin className="w-3 h-3 text-slate-400" />
              {voucher.partyBeat}
            </span>

            {voucher.partyGstin && (
              <span className="font-mono text-[11px] text-slate-400">
                GST: {voucher.partyGstin}
              </span>
            )}
          </div>
        </div>

        {/* Due Date Badge */}
        <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200/70 text-xs font-medium">
            <Calendar className="w-3 h-3 text-amber-600" />
            <span>Due: {voucher.dueDate}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Issued {voucher.date}
          </span>
        </div>
      </div>

      {/* 2. FORENSIC MATH ALERT CARD (Refined Rose-Tinted Card) */}
      {voucher.hasMathAnomaly ? (
        <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4.5 flex flex-col gap-2.5 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-rose-900 font-semibold text-sm">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Math Discrepancy Caught in Field Note</span>
            </div>
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
              Saved {formatINR(Math.abs(voucher.mathDiscrepancy))} Error
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/70 rounded-lg p-3 border border-rose-100 text-xs font-mono">
            <div>
              <div className="text-[10px] text-slate-400 font-sans uppercase">Stated Balance</div>
              <div className="text-sm font-semibold text-rose-600 line-through">
                {formatINR(voucher.statedUdhaar)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-sans uppercase">AI Audited Balance</div>
              <div className="text-sm font-bold text-slate-900">
                {formatINR(voucher.computedUdhaar)}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 font-sans uppercase">Discrepancy Blocked</div>
              <div className="text-sm font-bold text-rose-700">
                + {formatINR(Math.abs(voucher.mathDiscrepancy))}
              </div>
            </div>
          </div>

          <p className="text-xs text-rose-800 leading-relaxed font-sans">
            {voucher.anomalyDetails?.explanation ||
              `Field note claimed ₹${voucher.statedUdhaar} remaining, but exact arithmetic (${formatINR(voucher.totalAmount)} Total - ${formatINR(voucher.paidAmount)} Paid) equals ${formatINR(voucher.computedUdhaar)}. Prevented an artificial overstatement.`}
          </p>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Arithmetic 100% Verified: Total bill matches payments and stated balance.</span>
          </div>
          <span className="font-mono font-medium text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
            Clean Settlement
          </span>
        </div>
      )}

      {/* 3. MINIMALIST ITEM TABLE (Clean Horizontal Row Dividers Only, Generous Row Height py-3.5) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pr-4 font-normal">Item</th>
              <th className="pb-3 px-4 text-right font-normal">Qty</th>
              <th className="pb-3 px-4 text-right font-normal">Rate</th>
              <th className="pb-3 pl-4 text-right font-normal">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {voucher.items && voucher.items.length > 0 ? (
              voucher.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 pr-4 text-slate-800 font-medium">
                    <div>{item.particulars}</div>
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                      {item.godownAction || 'Direct Delivery'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 whitespace-nowrap">
                    {item.qty} <span className="text-[11px] text-slate-400 font-sans">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 whitespace-nowrap">
                    {Number(item.estRate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 pl-4 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                    {Number(item.lineTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-400 italic text-xs">
                  No line items extracted.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. VISUAL CREDIT RISK BAR (Smooth rounded progress bar h-2.5 rounded-full) */}
      <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/60 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">Settlement Exposure</span>
          <span className="text-slate-500 font-mono text-[11px]">
            Paid: {paidPercent.toFixed(0)}% • Udhaar: {udhaarPercent.toFixed(0)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${paidPercent}%` }}
            className="h-full bg-emerald-500 transition-all duration-500"
            title={`Realized: ${formatINR(voucher.paidAmount)}`}
          />
          <div
            style={{ width: `${udhaarPercent}%` }}
            className={`h-full transition-all duration-500 ${
              voucher.hasMathAnomaly ? 'bg-rose-500' : 'bg-amber-400'
            }`}
            title={`Udhaar: ${formatINR(voucher.computedUdhaar)}`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Realized ({voucher.paymentMode}): {formatINR(voucher.paidAmount)}
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                voucher.hasMathAnomaly ? 'bg-rose-500' : 'bg-amber-400'
              }`}
            ></span>
            Audited Udhaar: {formatINR(voucher.computedUdhaar)}
          </span>
        </div>
      </div>

      {/* 5. TOTALS LEDGER SUMMARY */}
      <div className="border-t border-slate-100 pt-3.5 flex flex-col gap-2 font-mono text-xs">
        <div className="flex justify-between text-slate-500">
          <span>Gross Invoice Total:</span>
          <span className="font-medium text-slate-900">{formatINR(voucher.totalAmount)}</span>
        </div>
        <div className="flex justify-between text-emerald-700">
          <span>Less: Realized Amount ({voucher.paymentMode}):</span>
          <span className="font-medium">- {formatINR(voucher.paidAmount)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-100 text-sm">
          <span className="font-semibold text-slate-900 font-sans">Net Audited Balance (Udhaar):</span>
          <span
            className={`font-bold text-base ${
              voucher.hasMathAnomaly ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {formatINR(voucher.computedUdhaar)}
          </span>
        </div>
      </div>

      {/* 6. INSTANT UPI PAYMENT QR CODE (Based on Net Udhaar) */}
      <UpiPaymentQr
        voucher={voucher}
        onMarkPaid={onUpdateVoucher}
      />

      {/* 7. 2 CLEAN BOTTOM ACTION BUTTONS: 🟢 Send WhatsApp Parchi + Excel and ➕ Save to Master Ledger */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
        {/* 🟢 Send WhatsApp Parchi + Excel */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-all font-medium text-xs sm:text-sm text-center flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99]"
        >
          <Share2 className="w-4 h-4 text-emerald-600" />
          <span>🟢 Send WhatsApp Parchi + Excel</span>
        </a>

        {/* ➕ Save to Master Ledger */}
        <button
          type="button"
          onClick={() => onAppendToRegister(voucher)}
          className={`w-full sm:flex-1 py-3 px-4 rounded-xl border transition-all font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99] ${
            isAppended
              ? 'border-slate-300 bg-slate-50 text-slate-500'
              : 'border-slate-900 bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          {isAppended ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Saved to Master Ledger ✓</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              <span>➕ Save to Master Ledger</span>
            </>
          )}
        </button>

        {/* Quick SMS intent link */}
        <a
          href={smsUrl}
          onClick={handleSmsClick}
          className="p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200/80 rounded-xl transition-colors cursor-pointer shrink-0"
          title="Send SMS summary to customer via native mobile intent"
        >
          <MessageSquare className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
