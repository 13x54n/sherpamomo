import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    reviewCount: number;
    ingredients: string[];
    amount: number;
    unit: string;
    featured?: boolean;
    inStock?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Chicken', 'Veg', 'Buff', 'Pork', 'Beef', 'Sauce']
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    ingredients: [{
        type: String,
        trim: true
    }],
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    unit: {
        type: String,
        required: true,
        enum: ['pcs', 'jar', 'container', 'lbs', 'oz']
    },
    featured: {
        type: Boolean,
        default: false
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better query performance
ProductSchema.index({ category: 1, featured: -1, rating: -1 });
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);