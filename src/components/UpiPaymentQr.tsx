import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Smartphone
} from 'lucide-react';
import { Voucher } from '../types/voucher';

interface UpiPaymentQrProps {
  voucher: Voucher;
  onMarkPaid?: (updatedVoucher: Voucher) => void;
}

export const UpiPaymentQr: React.FC<UpiPaymentQrProps> = ({
  voucher,
  onMarkPaid,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMarkingPaid, setIsMarkingPaid] = useState<boolean>(false);

  const netUdhaar = voucher.computedUdhaar || 0;
  const payeeVpa = 'vyaparvault.indore@icici';
  const payeeName = 'VyaparVault Wholesale Mandi';

  // Format INR currency
  const formatINR = (val: number) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Standard NPCI UPI URI Scheme
  const upiUri = `upi://pay?pa=${encodeURIComponent(payeeVpa)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${netUdhaar.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
    `Voucher ${voucher.voucherNumber} Settlement - ${voucher.partyName}`
  )}`;

  // Generate QR code whenever the net amount or voucher changes
  useEffect(() => {
    if (netUdhaar <= 0) {
      setQrDataUrl('');
      return;
    }

    let isMounted = true;
    QRCode.toDataURL(upiUri, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate UPI QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [upiUri, netUdhaar]);

  const handleCopyVpa = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(payeeVpa).catch(() => {});
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleMarkAsPaid = () => {
    if (!onMarkPaid || netUdhaar <= 0) return;
    setIsMarkingPaid(true);

    setTimeout(() => {
      const updated: Voucher = {
        ...voucher,
        paidAmount: voucher.totalAmount,
        computedUdhaar: 0,
        statedUdhaar: 0,
        hasMathAnomaly: false,
        mathDiscrepancy: 0,
        paymentMode: 'UPI',
        creditRisk: {
          ...voucher.creditRisk,
          exposurePercent: 0,
          riskRating: 'LOW',
          badgeText: 'SETTLED VIA INSTANT UPI',
          cfoDirective: 'Account fully cleared via UPI QR scan.',
        },
        anomalyDetails: {
          ...voucher.anomalyDetails,
          actualBalance: 0,
          statedBalance: 0,
          discrepancyCaught: 0,
          explanation: 'Account balance cleared in full via Instant UPI QR scan.',
          riskClassification: 'CLEAN_SETTLEMENT',
        },
      };

      onMarkPaid(updated);
      setIsMarkingPaid(false);
    }, 400);
  };

  // If Net Udhaar is already 0, show a settled confirmation badge
  if (netUdhaar <= 0) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-900 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Net Udhaar Settled: ₹0.00 outstanding on this voucher.</span>
        </div>
        <span className="font-mono font-medium text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
          Fully Paid ✓
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col gap-3 transition-all">
      {/* Header Bar with Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <span>Instant UPI Payment QR</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.2 rounded font-medium">
                Scan to Settle
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Payable: <span className="font-bold text-slate-900">{formatINR(netUdhaar)}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? 'Hide QR' : 'Show QR'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded QR Display & Payment Card */}
      {isExpanded && (
        <div className="pt-2 border-t border-slate-200/70 flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl p-4 border border-slate-100 shadow-2xs">
          {/* Real Scannable QR Code Canvas */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs relative group">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`UPI QR code for ${formatINR(netUdhaar)}`}
                  className="w-36 h-36 object-contain rounded-lg"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center bg-slate-50 rounded-lg text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">
              BHIM UPI • NPCI Standard
            </span>
          </div>

          {/* Right Details & Quick Actions */}
          <div className="flex-1 flex flex-col gap-2.5 text-xs w-full">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Amount to Pay (Net Udhaar)
              </span>
              <div className="text-xl font-bold font-mono text-emerald-700 tracking-tight">
                {formatINR(netUdhaar)}
              </div>
            </div>

            {/* VPA / Payee Info */}
            <div className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-500">
                <span>UPI VPA:</span>
                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="flex items-center gap-1 text-slate-700 hover:text-slate-900 cursor-pointer font-medium"
                  title="Copy UPI ID"
                >
                  <span>{payeeVpa}</span>
                  {isCopied ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Payee:</span>
                <span className="text-slate-800 font-sans font-medium">{payeeName}</span>
              </div>
            </div>

            {/* Supported Payment Apps */}
            <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-500 font-medium">
              <span className="text-slate-400">Accepted Apps:</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">GPay</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">PhonePe</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">Paytm</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">BHIM</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">CRED</span>
            </div>

            {/* Actions: Open Native UPI Intent + Mark Paid Button */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Direct UPI deep link on mobile */}
              <a
                href={upiUri}
                className="flex-1 min-w-[120px] py-1.5 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-[11px] text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Open installed UPI app (GPay / PhonePe / Paytm)"
              >
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>Open in UPI App</span>
              </a>

              {/* Instant Clearance Trigger */}
              {onMarkPaid && (
                <button
                  type="button"
                  onClick={handleMarkAsPaid}
                  disabled={isMarkingPaid}
                  className="flex-1 min-w-[140px] py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Mark balance as received and update voucher"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isMarkingPaid ? 'Clearing...' : 'Mark as Paid via UPI'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
