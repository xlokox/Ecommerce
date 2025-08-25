import { Schema, model } from 'mongoose';

const campaignSchema = new Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '', trim: true },
  image: { type: String, required: true },
  textColor: { type: String, default: '#ffffff' },
  titleSize: { type: Number, default: 48, min: 8, max: 200 },
  ctaText: { type: String, default: '' },
  ctaLink: { type: String, default: '' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  startAt: { type: Date, default: null },
  endAt: { type: Date, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'admins', required: false }
}, { timestamps: true });

export default model('Campaign', campaignSchema);

