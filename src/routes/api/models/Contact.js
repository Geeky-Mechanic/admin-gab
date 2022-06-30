import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        subj: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        date:{
            type: Number,
            required: true,
        },
        answered: {
            type: Boolean,
            required: true,
        }
    },
);

export default  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);