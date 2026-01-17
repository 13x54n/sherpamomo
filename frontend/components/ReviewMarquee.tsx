import { Star } from 'lucide-react';

const reviews = [
    { id: 1, name: "John Doe", text: "Absolutely authentic taste! Reminds me of my trip to Nepal.", color: "bg-primary/20 text-primary", initial: "JD" },
    { id: 2, name: "Alice Smith", text: "Great value for money. The sauce is incredible.", color: "bg-secondary/20 text-secondary", initial: "AS" },
    { id: 3, name: "Rames Shrestha", text: "Best momos in town. The jhol is perfect.", color: "bg-green-500/20 text-green-600", initial: "RS" },
    { id: 4, name: "Emily White", text: "Love the packaging and freshness.", color: "bg-blue-500/20 text-blue-600", initial: "EW" },
    { id: 5, name: "David Miller", text: "Spicy and delicious. Will order again!", color: "bg-orange-500/20 text-orange-600", initial: "DM" },
];

export default function ReviewMarquee() {
    return (
        <div className="relative w-full overflow-hidden mask-gradient-x">
            <div className="absolute left-0 top-0 bottom-0 w-20  from-background to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 from-background to-transparent z-10"></div>

            <div className="flex w-max min-w-full animate-marquee ">
                {/* First Set */}
                <div className="flex gap-6 px-3">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
                {/* Duplicate Set for Seamless Loop */}
                <div className="flex gap-6 px-3">
                    {reviews.map((review) => (
                        <ReviewCard key={`dup-${review.id}`} review={review} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ReviewCard({ review }: { review: any }) {
    return (
        <div className="w-[350px] p-6 rounded-2xl bg-muted/10 border border-border/50 hover:border-primary/30 transition-colors flex-shrink-0">
            <div className="flex items-center gap-1 text-yellow-500 mb-3">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
            </div>
            <p className="italic text-muted-foreground mb-4 line-clamp-2">"{review.text}"</p>
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${review.color} flex items-center justify-center font-bold text-xs`}>
                    {review.initial}
                </div>
                <span className="text-sm font-semibold">{review.name}</span>
            </div>
        </div>
    );
}
