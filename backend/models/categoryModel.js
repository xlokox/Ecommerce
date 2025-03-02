import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true }
}, { timestamps: true });

categorySchema.index({ name: 'text' });

// לוודא שהאינדקס נוצר
categorySchema.on("index", (error) => {
  if (error) console.error("Indexing error:", error);
});

export default model("Category", categorySchema);
