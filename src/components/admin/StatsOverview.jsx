import React from 'react';
import { Card } from '@/components/ui/card';
import {
    FileText,
    Users,
    ShieldAlert,
    CheckCircle,
    UserX,
    Flag,
    TrendingUp,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatsOverview({ stats }) {
    const cards = [
        {
            label: 'Total Posts',
            value: stats.totalPosts || 0,
            icon: FileText,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            trend: '+12%'
        },
        {
            label: 'Flagged Stories',
            value: stats.flaggedPosts || 0,
            icon: Clock,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            trend: 'Pending'
        },
        {
            label: 'Total Users',
            value: stats.totalUsers || 0,
            icon: Users,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            trend: '+5%'
        },
        {
            label: 'Blocked Users',
            value: stats.blockedUsers || 0,
            icon: UserX,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            trend: 'Security'
        },
        {
            label: 'User Reports',
            value: stats.pendingReports || 0,
            icon: Flag,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            trend: 'Urgent'
        },
        {
            label: 'Active Today',
            value: stats.activeUsers || 0,
            icon: CheckCircle,
            color: 'text-teal-500',
            bg: 'bg-teal-500/10',
            trend: 'Online'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6 mb-12">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <Card
                        key={index}
                        className="p-6 bg-card/40 backdrop-blur-xl border-border/40 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden rounded-[2.5rem] animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Icon className="w-16 h-16" />
                        </div>

                        <div className="flex items-start justify-between relative z-10">
                            <div className={cn(
                                "p-3 rounded-2xl shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                                card.bg
                            )}>
                                <Icon className={cn("w-6 h-6", card.color)} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                                card.color.replace('text-', 'bg-').replace('500', '500/10'),
                                card.color
                            )}>
                                {card.trend}
                            </span>
                        </div>

                        <div className="mt-8 relative z-10">
                            <h3 className="text-4xl font-black text-foreground tabular-nums tracking-tighter">
                                {card.value}
                            </h3>
                            <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-[0.2em]">
                                {card.label}
                            </p>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}

