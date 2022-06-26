import mongoose from 'mongoose';
// ADD ADDRESS AND POSTAL CODE AND REJECTED
const BookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        begHour: {
            type: Number,
            required: true,
        },
        endHour: {
            type: Number,
            required: true,
        },
        completed: {
            type: Boolean,
            require: true,
        },
        confirmed: {
            type: Boolean,
            required: true,
        }
    },
);

export default  mongoose.models.Book || mongoose.model("Book", BookSchema);
