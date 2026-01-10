"use client";


interface ReceiptPreviewProps {
  receiptConfig: ReceiptConfig;
  branchName?: string;
  currency?: string;
}

export function ReceiptPreview({ receiptConfig, branchName, currency = "PKR" }: ReceiptPreviewProps) {
  const {
    showLogo = false,
    logoUrl = "",
    showQRCode = false,
    qrCodeData = "",
    headerText = "",
    footerText = "Thank you for your business!",
    showTaxBreakdown = true,
    showItemCodes = false,
    paperWidth = 80,
    fontSizeMultiplier = 1.0,
  } = receiptConfig;

  // Calculate scale based on paper width
  const scale = paperWidth === 58 ? 0.725 : 1;
  const fontSize = fontSizeMultiplier * scale;

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 sticky top-6">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Receipt Preview</div>

      <div
        className="bg-white border border-dashed border-gray-300 rounded-sm overflow-hidden"
        style={{
          width: `${paperWidth === 58 ? '232px' : '320px'}`,
          maxWidth: '100%',
        }}
      >
        <div className="p-4 space-y-3" style={{ fontSize: `${fontSize}rem` }}>
          {/* Logo */}
          {showLogo && logoUrl && (
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">LOGO</span>
              </div>
            </div>
          )}

          {/* Header Text */}
          {headerText && (
            <div className="text-center font-bold text-gray-900 border-b border-dashed border-gray-300 pb-2">
              {headerText}
            </div>
          )}

          {/* Branch Name */}
          <div className="text-center">
            <div className="font-bold text-gray-900">{branchName || "Branch Name"}</div>
            <div className="text-xs text-gray-500">123 Main Street, City</div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-300" />

          {/* Order Info */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Order #:</span>
              <span className="font-semibold">ORD-001234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cashier:</span>
              <span className="font-semibold">John Doe</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-300" />

          {/* Items */}
          <div className="space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider">Items</div>
            {[
              { name: "Burger Deluxe", code: "ITM-001", qty: 2, price: 450 },
              { name: "French Fries", code: "ITM-002", qty: 1, price: 150 },
              { name: "Soft Drink", code: "ITM-003", qty: 2, price: 200 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between">
                  <span className="flex-1">{item.name}</span>
                  <span className="font-semibold">{currency} {item.price}</span>
                </div>
                {showItemCodes && (
                  <div className="text-xs text-gray-500 pl-2">Code: {item.code}</div>
                )}
                <div className="text-xs text-gray-500 pl-2">Qty: {item.qty}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-300" />

          {/* Totals */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">{currency} 800</span>
            </div>
            {showTaxBreakdown && (
              <div className="flex justify-between text-gray-600">
                <span>Tax (15%):</span>
                <span>{currency} 120</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-1">
              <span>Total:</span>
              <span>{currency} 920</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-t border-dashed border-gray-300 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold">Cash</span>
            </div>
          </div>

          {/* Footer Text */}
          {footerText && (
            <div className="text-center text-xs text-gray-600 border-t border-dashed border-gray-300 pt-2">
              {footerText}
            </div>
          )}

          {/* QR Code */}
          {showQRCode && qrCodeData && (
            <div className="flex justify-center pt-2">
              <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">QR</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>Paper Width:</span>
          <span className="font-semibold">{paperWidth}mm</span>
        </div>
        <div className="flex justify-between">
          <span>Font Size:</span>
          <span className="font-semibold">{fontSizeMultiplier}x</span>
        </div>
      </div>
    </div>
  );
}
