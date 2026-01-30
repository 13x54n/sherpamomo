import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    unit: string;
}

export interface IOrder extends Document {
    orderId: string;
    userId?: Schema.Types.ObjectId;
    items: IOrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    status: 'pending' | 'packaging' | 'delivered' | 'cancelled' | 'completed' | 'failed';
    customerInfo?: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    paymentInfo?: {
        method: string;
        status: 'pending' | 'completed' | 'failed';
        transactionId?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema({
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
}, { _id: false });

const OrderSchema: Schema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        // Not required for backwards compatibility with existing orders
    },
    items: [OrderItemSchema],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    shipping: {
        type: Number,
        default: 5.00,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'completed', 'failed'],
        default: 'pending'
    },
    customerInfo: {
        name: String,
        email: String,
        phone: String,
        address: String
    },
    paymentInfo: {
        method: String,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        },
        transactionId: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better query performance
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'customerInfo.email': 1 });

export default mongoose.model<IOrder>('Order', OrderSchema);