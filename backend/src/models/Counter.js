import mongoose from "mongoose";

// MENYIMPAN DATA COUNTER
const counterSchema = new mongoose.Schema({
    // _id akan menjadi nama counter
    // (Contoh: "teamId" atau "useCaseId")
    _id: {
        type: String,
        required: true
    },

    //'seq' adalah angka terakhir yang digunakan
    // Contoh: "9"
    seq: {
        type: Number,
        default: 0
    }
})

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;
