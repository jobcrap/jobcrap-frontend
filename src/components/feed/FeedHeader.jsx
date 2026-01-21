import { Badge } from '@/components/ui/badge';

export default function FeedHeader() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-8 border border-primary/10">
            <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-4">
                    Workplace <span className="text-primary bg-clip-text">Truths</span>.
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6 font-medium">
                    Explore thousands of anonymous stories from employees worldwide.
                    Unfiltered, honest, and completely confidential.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="px-3 py-1 bg-background/50 border-primary/20 text-primary">
                        🔥 Hot Topics
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 bg-background/50 border-border/50 text-muted-foreground">
                        🌍 Global Feed
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 bg-background/50 border-border/50 text-muted-foreground">
                        🛡️ 100% Anonymous
                    </Badge>
                </div>
            </div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        </div>
    );
}
