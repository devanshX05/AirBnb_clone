const bookingSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    home: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Home",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    razorpayOrderId: {
        type: String,
        required: true
    },

    razorpayPaymentId: {
        type: String,
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created"
    },

    bookingDate: {
        type: Date,
        default: Date.now
    }

});