import React from "react";
import { History, Database, RefreshCw, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackupHistoryItem } from '@/lib/types/backup';

interface BackupHistoryCardProps {
    backupHistory: BackupHistoryItem[];
    restoring: string | null;
    deleting: string | null;
    onRestore: (backupId: string) => void;
    onDelete: (backupId: string) => void;
}

export const BackupHistoryCard: React.FC<BackupHistoryCardProps> = ({
    backupHistory,
    restoring,
    deleting,
    onRestore,
    onDelete,
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "text-gray-600 bg-gray-100";
            case "failed": return "text-red-600 bg-red-100";
            case "in-progress": return "text-blue-600 bg-blue-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History size={20} />
                    Backup History
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {backupHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Database size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No backups found</p>
                    </div>
                ) : (
                    backupHistory.map((backup) => (
                        <div key={backup.id} className="border border-gray-200 rounded-sm p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-medium">{backup.date}</p>
                                    <p className="text-sm text-gray-500">{backup.size} • {backup.type}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(backup.status)}`}>
                                    {backup.status}
                                </span>
                            </div>

                            <div className="mb-3">
                                <p className="text-xs text-gray-500 mb-1">Includes:</p>
                                <div className="flex flex-wrap gap-1">
                                    {backup.includes.map((item, index) => (
                                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => onRestore(backup.id)}
                                    disabled={restoring === backup.id}
                                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
                                >
                                    {restoring === backup.id ? (
                                        <>
                                            <div className="animate-spin h-3 w-3 border-b-2 border-blue-700 rounded-full"></div>
                                            Restoring...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw size={14} />
                                            Restore
                                        </>
                                    )}
                                </button>
                                <button className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                                    <Download size={14} />
                                    Download
                                </button>
                                <button
                                    onClick={() => onDelete(backup.id)}
                                    disabled={deleting === backup.id}
                                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors md:ml-auto ${deleting === backup.id
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-[#2C2C2C] text-white hover:bg-gray-700"
                                        }`}
                                >
                                    {deleting === backup.id ? (
                                        <>
                                            <div className="animate-spin h-3 w-3 border-b-2 border-gray-400 rounded-full"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={12} />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};