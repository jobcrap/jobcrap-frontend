import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    MoreVertical,
    Trash2,
    Eye,
    Ban,
    CheckCircle,
    User,
    Mail,
    Calendar,
    ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDataTable({
    data,
    type,
    onAction,
    onNavigate,
    isLoading
}) {
    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-[#202123] rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-white dark:bg-[#202123] rounded-2xl border border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 font-medium">No results found</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#202123] shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-[#343541] border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            {type === 'users' ? (
                                <>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined At</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Story Content</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metrics</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {data.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-[#343541]/50 transition-colors">
                                {type === 'users' ? (
                                    <>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.username || 'Anonymous'}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {item.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.isBlocked ? (
                                                <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none px-2 py-0.5">Blocked</Badge>
                                            ) : (
                                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none px-2 py-0.5">Active</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!item.isBlocked ? (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => onAction('block', item)}
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 h-8 w-8 p-0"
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => onAction('unblock', item)}
                                                        className="text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 h-8 w-8 p-0"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1 max-w-md">
                                                {item.text}
                                            </p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-tight">
                                                ID: {item._id}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="text-[10px] dark:border-gray-700 capitalize">
                                                {item.category}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <div className="text-center">
                                                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{item.upvotes || 0}</p>
                                                    <p className="text-[8px] text-gray-500 uppercase">Up</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{item.commentsCount || 0}</p>
                                                    <p className="text-[8px] text-gray-500 uppercase">Com</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onNavigate(`/post/${item._id}`)}
                                                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onAction('delete', item)}
                                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
