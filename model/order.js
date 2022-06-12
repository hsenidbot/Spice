const mongosse =require("mongoose");

const OrderSchema=mongosse({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
             },
             quantity: {
                type: Number,
                required: true,
             },
             image: {
                type: String,
                required: true,
             },
             price: {
                type: Number,
                required: true,
             },
             food: {
                type: mongoose.Schema.ObjectId,
                ref: 'food',
                required: true,
             },
        }
    ],
})