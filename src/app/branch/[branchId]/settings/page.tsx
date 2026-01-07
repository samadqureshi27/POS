"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Settings, CreditCard, Receipt, RotateCcw, Save } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { GlobalSkeleton } from "@/components/ui/global-skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { useBranchPOSConfig } from "@/lib/hooks/useBranchPOSConfig";
import { ReceiptPreview } from "./_components/receipt-preview";
import type { ReceiptConfig, PaymentMethods } from "@/lib/services/branch-pos-config-service";

const BranchSettingsPage = () => {
  const params = useParams();
  const branchId = (params?.branchId as string) || "";

  const {
    config,
    loading,
    actionLoading,
    paymentMode,
    enableTableService,
    receiptConfig: initialReceiptConfig,
    paymentMethods: initialPaymentMethods,
    branchName,
    currency,
    updatePaymentMode,
    updateReceiptConfig,
    updatePaymentMethods,
    updatePOSConfig,
    resetReceiptConfig,
  } = useBranchPOSConfig(branchId);

  // Local state for collapsible sections
  const [expandedSection, setExpandedSection] = useState<string | null>("general-settings");

  // Local state for forms
  const [localPaymentMode, setLocalPaymentMode] = useState<"payNow" | "payLater">(paymentMode);
  const [localTableService, setLocalTableService] = useState(enableTableService);
  const [localReceiptConfig, setLocalReceiptConfig] = useState<ReceiptConfig>({});
  const [localPaymentMethods, setLocalPaymentMethods] = useState<PaymentMethods>({});

  // Additional POS config fields
  const [localOrderPrefix, setLocalOrderPrefix] = useState<string>("");
  const [localReceiptFooter, setLocalReceiptFooter] = useState<string>("");
  const [localEnableHoldOrders, setLocalEnableHoldOrders] = useState<boolean>(true);

  // Reset confirmation dialog
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Update local state when data loads - using JSON stringify to prevent infinite loops
  React.useEffect(() => {
    setLocalPaymentMode(paymentMode);
    setLocalTableService(enableTableService);
  }, [paymentMode, enableTableService]);

  React.useEffect(() => {
    if (config?.posConfig?.receiptConfig) {
      setLocalReceiptConfig(config.posConfig.receiptConfig);
    }
  }, [config]);

  React.useEffect(() => {
    if (config?.posConfig?.paymentMethods) {
      setLocalPaymentMethods(config.posConfig.paymentMethods);
    }
  }, [config]);

  React.useEffect(() => {
    if (config?.posConfig) {
      setLocalOrderPrefix(config.posConfig.orderPrefix || "");
      setLocalReceiptFooter(config.posConfig.receiptFooter || "");
      setLocalEnableHoldOrders(config.posConfig.enableHoldOrders !== false);
    }
  }, [config]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSavePaymentMode = async () => {
    await updatePaymentMode(localPaymentMode, localTableService);
  };

  const handleSaveReceiptConfig = async () => {
    await updateReceiptConfig(localReceiptConfig);
  };

  const handleSavePaymentMethods = async () => {
    await updatePaymentMethods(localPaymentMethods);
  };

  const handleSaveGeneralSettings = async () => {
    await updatePOSConfig({
      orderPrefix: localOrderPrefix,
      receiptFooter: localReceiptFooter,
      enableHoldOrders: localEnableHoldOrders,
    });
  };

  const handleResetReceiptConfig = async () => {
    const success = await resetReceiptConfig();
    if (success) {
      setResetDialogOpen(false);
    }
  };

  if (loading) {
    return <GlobalSkeleton type="management" showSummaryCards={false} showActionBar={false} hasSubmenu={true} />;
  }

  return (
    <PageContainer hasSubmenu={true}>
      <div className="pt-6">
        <PageHeader
          title={`POS Settings - ${branchName || `Branch #${branchId}`}`}
          subtitle="Configure payment modes, receipt settings, and payment methods"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Sections */}
        <div className="lg:col-span-2 space-y-4">
          {/* General Settings Section */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <button
              onClick={() => toggleSection("general-settings")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">General Settings</h3>
                  <p className="text-xs text-gray-500">Configure order prefix, footer, and hold orders</p>
                </div>
              </div>
              <div
                className={cn(
                  "h-5 w-5 text-gray-400 transition-transform",
                  expandedSection === "general-settings" ? "rotate-180" : ""
                )}
              >
                ▼
              </div>
            </button>

            {expandedSection === "general-settings" && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
                <div className="space-y-4 pt-4">
                  {/* Order Prefix */}
                  <div>
                    <Label htmlFor="orderPrefix" className="text-sm font-semibold">
                      Order Prefix
                    </Label>
                    <Input
                      id="orderPrefix"
                      placeholder="ORD"
                      value={localOrderPrefix}
                      onChange={(e) => setLocalOrderPrefix(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Prefix for order numbers (e.g., ORD-001234)</p>
                  </div>

                  {/* Receipt Footer */}
                  <div>
                    <Label htmlFor="receiptFooter" className="text-sm font-semibold">
                      Receipt Footer (Legacy)
                    </Label>
                    <Textarea
                      id="receiptFooter"
                      placeholder="Thank you!"
                      value={localReceiptFooter}
                      onChange={(e) => setLocalReceiptFooter(e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                    <p className="text-xs text-gray-500 mt-1">Legacy footer text (consider using Receipt Config instead)</p>
                  </div>

                  {/* Enable Hold Orders */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-gray-100">
                    <div>
                      <Label className="text-sm font-semibold">Enable Hold Orders</Label>
                      <p className="text-xs text-gray-500">Allow orders to be put on hold</p>
                    </div>
                    <Switch
                      checked={localEnableHoldOrders}
                      onCheckedChange={setLocalEnableHoldOrders}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleSaveGeneralSettings}
                    disabled={actionLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save General Settings
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Mode Section */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <button
              onClick={() => toggleSection("payment-mode")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Payment Mode</h3>
                  <p className="text-xs text-gray-500">Configure when customers pay</p>
                </div>
              </div>
              <div
                className={cn(
                  "h-5 w-5 text-gray-400 transition-transform",
                  expandedSection === "payment-mode" ? "rotate-180" : ""
                )}
              >
                ▼
              </div>
            </button>

            {expandedSection === "payment-mode" && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
                <div className="space-y-4 pt-4">
                  {/* Payment Mode Toggle */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Payment Timing</Label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setLocalPaymentMode("payNow")}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-sm border-2 transition-all",
                          localPaymentMode === "payNow"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="font-bold text-sm">Pay Now</div>
                        <div className="text-xs text-gray-500">Fast food / Counter service</div>
                      </button>
                      <button
                        onClick={() => setLocalPaymentMode("payLater")}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-sm border-2 transition-all",
                          localPaymentMode === "payLater"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="font-bold text-sm">Pay Later</div>
                        <div className="text-xs text-gray-500">Fine dining / Table service</div>
                      </button>
                    </div>
                  </div>

                  {/* Table Service Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-gray-100">
                    <div>
                      <Label className="text-sm font-semibold">Enable Table Service</Label>
                      <p className="text-xs text-gray-500">Allow orders to be assigned to tables</p>
                    </div>
                    <Switch
                      checked={localTableService}
                      onCheckedChange={setLocalTableService}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleSavePaymentMode}
                    disabled={actionLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Payment Mode
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Receipt Configuration Section */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <button
              onClick={() => toggleSection("receipt-config")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-sm bg-green-50 border border-green-100 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Receipt Configuration</h3>
                  <p className="text-xs text-gray-500">Customize receipt appearance</p>
                </div>
              </div>
              <div
                className={cn(
                  "h-5 w-5 text-gray-400 transition-transform",
                  expandedSection === "receipt-config" ? "rotate-180" : ""
                )}
              >
                ▼
              </div>
            </button>

            {expandedSection === "receipt-config" && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
                <div className="space-y-4 pt-4">
                  {/* Logo Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-gray-100">
                      <div>
                        <Label className="text-sm font-semibold">Show Logo</Label>
                        <p className="text-xs text-gray-500">Display logo on receipt</p>
                      </div>
                      <Switch
                        checked={localReceiptConfig.showLogo || false}
                        onCheckedChange={(checked) =>
                          setLocalReceiptConfig({ ...localReceiptConfig, showLogo: checked })
                        }
                      />
                    </div>

                    {localReceiptConfig.showLogo && (
                      <div>
                        <Label htmlFor="logoUrl" className="text-sm font-semibold">
                          Logo URL
                        </Label>
                        <Input
                          id="logoUrl"
                          placeholder="https://example.com/logo.png"
                          value={localReceiptConfig.logoUrl || ""}
                          onChange={(e) =>
                            setLocalReceiptConfig({ ...localReceiptConfig, logoUrl: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>

                  {/* Header Text */}
                  <div>
                    <Label htmlFor="headerText" className="text-sm font-semibold">
                      Header Text
                    </Label>
                    <Input
                      id="headerText"
                      placeholder="Welcome to Our Restaurant"
                      value={localReceiptConfig.headerText || ""}
                      onChange={(e) =>
                        setLocalReceiptConfig({ ...localReceiptConfig, headerText: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  {/* Footer Text */}
                  <div>
                    <Label htmlFor="footerText" className="text-sm font-semibold">
                      Footer Text
                    </Label>
                    <Textarea
                      id="footerText"
                      placeholder="Thank you for your business!"
                      value={localReceiptConfig.footerText || ""}
                      onChange={(e) =>
                        setLocalReceiptConfig({ ...localReceiptConfig, footerText: e.target.value })
                      }
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  {/* QR Code Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-gray-100">
                      <div>
                        <Label className="text-sm font-semibold">Show QR Code</Label>
                        <p className="text-xs text-gray-500">Display QR code on receipt</p>
                      </div>
                      <Switch
                        checked={localReceiptConfig.showQRCode || false}
                        onCheckedChange={(checked) =>
                          setLocalReceiptConfig({ ...localReceiptConfig, showQRCode: checked })
                        }
                      />
                    </div>

                    {localReceiptConfig.showQRCode && (
                      <div>
                        <Label htmlFor="qrCodeData" className="text-sm font-semibold">
                          QR Code Data (URL)
                        </Label>
                        <Input
                          id="qrCodeData"
                          placeholder="https://restaurant.com/feedback"
                          value={localReceiptConfig.qrCodeData || ""}
                          onChange={(e) =>
                            setLocalReceiptConfig({ ...localReceiptConfig, qrCodeData: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>

                  {/* Display Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-gray-100">
                      <div>
                        <Label className="text-sm font-semibold">Show Tax Breakdown</Label>
                        <p className="text-xs text-gray-500">Display tax details on receipt</p>
                      </div>
                      <Switch
                        checked={localReceiptConfig.showTaxBreakdown !== false}
                        onCheckedChange={(checked) =>
                          setLocalReceiptConfig({ ...localReceiptConfig, showTaxBreakdown: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-gray-100">
                      <div>
                        <Label className="text-sm font-semibold">Show Item Codes</Label>
                        <p className="text-xs text-gray-500">Display item codes on receipt</p>
                      </div>
                      <Switch
                        checked={localReceiptConfig.showItemCodes || false}
                        onCheckedChange={(checked) =>
                          setLocalReceiptConfig({ ...localReceiptConfig, showItemCodes: checked })
                        }
                      />
                    </div>
                  </div>

                  {/* Paper Width */}
                  <div>
                    <Label htmlFor="paperWidth" className="text-sm font-semibold">
                      Paper Width (mm)
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => setLocalReceiptConfig({ ...localReceiptConfig, paperWidth: 58 })}
                        className={cn(
                          "flex-1 px-4 py-2 rounded-sm border-2 text-sm font-semibold transition-all",
                          localReceiptConfig.paperWidth === 58
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        58mm
                      </button>
                      <button
                        onClick={() => setLocalReceiptConfig({ ...localReceiptConfig, paperWidth: 80 })}
                        className={cn(
                          "flex-1 px-4 py-2 rounded-sm border-2 text-sm font-semibold transition-all",
                          localReceiptConfig.paperWidth === 80 || !localReceiptConfig.paperWidth
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        80mm
                      </button>
                    </div>
                  </div>

                  {/* Font Size Multiplier */}
                  <div>
                    <Label htmlFor="fontSizeMultiplier" className="text-sm font-semibold">
                      Font Size: {localReceiptConfig.fontSizeMultiplier || 1.0}x
                    </Label>
                    <Input
                      id="fontSizeMultiplier"
                      type="range"
                      min="0.8"
                      max="1.5"
                      step="0.1"
                      value={localReceiptConfig.fontSizeMultiplier || 1.0}
                      onChange={(e) =>
                        setLocalReceiptConfig({
                          ...localReceiptConfig,
                          fontSizeMultiplier: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => setResetDialogOpen(true)}
                    variant="outline"
                    disabled={actionLoading}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset to Defaults
                  </Button>
                  <Button
                    onClick={handleSaveReceiptConfig}
                    disabled={actionLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Receipt Config
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods Section */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <button
              onClick={() => toggleSection("payment-methods")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-sm bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Payment Methods</h3>
                  <p className="text-xs text-gray-500">Configure accepted payment methods</p>
                </div>
              </div>
              <div
                className={cn(
                  "h-5 w-5 text-gray-400 transition-transform",
                  expandedSection === "payment-methods" ? "rotate-180" : ""
                )}
              >
                ▼
              </div>
            </button>

            {expandedSection === "payment-methods" && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
                <div className="space-y-4 pt-4">
                  {/* Cash Payment */}
                  <div className="p-4 bg-gray-50 rounded-sm border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold">Cash Payment</Label>
                        <p className="text-xs text-gray-500">Accept cash payments</p>
                      </div>
                      <Switch
                        checked={localPaymentMethods.cash?.enabled !== false}
                        onCheckedChange={(checked) =>
                          setLocalPaymentMethods({
                            ...localPaymentMethods,
                            cash: { ...localPaymentMethods.cash, enabled: checked },
                          })
                        }
                      />
                    </div>
                    {localPaymentMethods.cash?.enabled !== false && (
                      <div>
                        <Label htmlFor="cashTaxRate" className="text-xs font-semibold">
                          Tax Rate Override (%)
                        </Label>
                        <Input
                          id="cashTaxRate"
                          type="number"
                          placeholder="Leave empty for default"
                          value={localPaymentMethods.cash?.taxRateOverride ?? ""}
                          onChange={(e) =>
                            setLocalPaymentMethods({
                              ...localPaymentMethods,
                              cash: {
                                ...localPaymentMethods.cash,
                                enabled: true,
                                taxRateOverride: e.target.value ? parseFloat(e.target.value) : null,
                              },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>

                  {/* Card Payment */}
                  <div className="p-4 bg-gray-50 rounded-sm border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold">Card Payment</Label>
                        <p className="text-xs text-gray-500">Accept card payments</p>
                      </div>
                      <Switch
                        checked={localPaymentMethods.card?.enabled !== false}
                        onCheckedChange={(checked) =>
                          setLocalPaymentMethods({
                            ...localPaymentMethods,
                            card: { ...localPaymentMethods.card, enabled: checked },
                          })
                        }
                      />
                    </div>
                    {localPaymentMethods.card?.enabled !== false && (
                      <>
                        <div>
                          <Label htmlFor="cardTaxRate" className="text-xs font-semibold">
                            Tax Rate Override (%)
                          </Label>
                          <Input
                            id="cardTaxRate"
                            type="number"
                            placeholder="Leave empty for default"
                            value={localPaymentMethods.card?.taxRateOverride ?? ""}
                            onChange={(e) =>
                              setLocalPaymentMethods({
                                ...localPaymentMethods,
                                card: {
                                  ...localPaymentMethods.card,
                                  enabled: true,
                                  taxRateOverride: e.target.value ? parseFloat(e.target.value) : null,
                                },
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardMinAmount" className="text-xs font-semibold">
                            Minimum Amount
                          </Label>
                          <Input
                            id="cardMinAmount"
                            type="number"
                            placeholder="0"
                            value={localPaymentMethods.card?.minAmount ?? 0}
                            onChange={(e) =>
                              setLocalPaymentMethods({
                                ...localPaymentMethods,
                                card: {
                                  ...localPaymentMethods.card,
                                  enabled: true,
                                  minAmount: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile Payment */}
                  <div className="p-4 bg-gray-50 rounded-sm border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold">Mobile Payment</Label>
                        <p className="text-xs text-gray-500">Accept mobile payments</p>
                      </div>
                      <Switch
                        checked={localPaymentMethods.mobile?.enabled !== false}
                        onCheckedChange={(checked) =>
                          setLocalPaymentMethods({
                            ...localPaymentMethods,
                            mobile: { ...localPaymentMethods.mobile, enabled: checked },
                          })
                        }
                      />
                    </div>
                    {localPaymentMethods.mobile?.enabled !== false && (
                      <div>
                        <Label htmlFor="mobileTaxRate" className="text-xs font-semibold">
                          Tax Rate Override (%)
                        </Label>
                        <Input
                          id="mobileTaxRate"
                          type="number"
                          placeholder="Leave empty for default"
                          value={localPaymentMethods.mobile?.taxRateOverride ?? ""}
                          onChange={(e) =>
                            setLocalPaymentMethods({
                              ...localPaymentMethods,
                              mobile: {
                                ...localPaymentMethods.mobile,
                                enabled: true,
                                taxRateOverride: e.target.value ? parseFloat(e.target.value) : null,
                              },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleSavePaymentMethods}
                    disabled={actionLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Payment Methods
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="lg:col-span-1">
          <ReceiptPreview
            receiptConfig={localReceiptConfig}
            branchName={branchName}
            currency={currency}
          />
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset Receipt Configuration"
        description="Are you sure you want to reset the receipt configuration to default values? This action cannot be undone."
        confirmText="Reset to Defaults"
        cancelText="Cancel"
        onConfirm={handleResetReceiptConfig}
        onCancel={() => setResetDialogOpen(false)}
        variant="destructive"
      />
    </PageContainer>
  );
};

export default BranchSettingsPage;
