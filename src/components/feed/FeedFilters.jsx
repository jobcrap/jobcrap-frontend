import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, PenSquare } from 'lucide-react';
import { CATEGORIES, COUNTRIES } from '@/utils/constants';

export default function FeedFilters({
    sortBy,
    onSortChange,
    selectedCategory,
    onCategoryChange,
    selectedCountry,
    onCountryChange,
    onClearFilters,
    hasActiveFilters,
    onShareClick,
    className = ""
}) {
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                    </div>
                    Discovery Filters
                </h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-[10px] h-6 px-2 text-muted-foreground hover:text-primary hover:bg-primary/5 font-bold uppercase tracking-wider"
                    >
                        Reset
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {/* Sort */}
                <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                        Sort By
                    </label>
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger className="w-full bg-background/50 border-border/50 rounded-xl h-11 focus:ring-primary/20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[100] bg-popover/95 backdrop-blur-lg">
                            <SelectItem value="recent">🕐 Recent</SelectItem>
                            <SelectItem value="trending">📈 Trending</SelectItem>
                            <SelectItem value="discussed">💬 Most Discussed</SelectItem>
                            <SelectItem value="top">🔥 Top Rated</SelectItem>
                            <SelectItem value="controversial">⚡ Controversial</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                        Category
                    </label>
                    <Select
                        value={selectedCategory || 'all'}
                        onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
                    >
                        <SelectTrigger className="w-full bg-background/50 border-border/50 rounded-xl h-11 focus:ring-primary/20">
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent className="z-[100] bg-popover/95 backdrop-blur-lg">
                            <SelectItem value="all">All Categories</SelectItem>
                            {CATEGORIES.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.emoji} {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Country Filter */}
                <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                        Country
                    </label>
                    <Select
                        value={selectedCountry || 'all'}
                        onValueChange={(value) => onCountryChange(value === 'all' ? null : value)}
                    >
                        <SelectTrigger className="w-full bg-background/50 border-border/50 rounded-xl h-11 focus:ring-primary/20">
                            <SelectValue placeholder="All countries" />
                        </SelectTrigger>
                        <SelectContent className="z-[100] bg-popover/95 backdrop-blur-lg">
                            <SelectItem value="all">All Countries</SelectItem>
                            {COUNTRIES.map(country => (
                                <SelectItem key={country.value} value={country.value}>
                                    {country.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {onShareClick && (
                <div className="mt-8 pt-6 border-t border-border/20">
                    <Button
                        className="w-full rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-primary/80 text-white font-bold h-12 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
                        onClick={onShareClick}
                    >
                        <PenSquare className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                        Share Your Story
                    </Button>
                </div>
            )}
        </div>
    );
}
