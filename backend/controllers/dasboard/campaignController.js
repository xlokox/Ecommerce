import formidable from 'formidable';
import cloudinary from 'cloudinary';
import Campaign from '../../models/campaignModel.js';
import { responseReturn } from '../../utiles/response.js';

cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true
});

class CampaignController {
  // Create campaign (image + fields)
  create = async (req, res) => {
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      try {
        if (err) return responseReturn(res, 400, { error: err.message });

        const {
          title = '',
          subtitle = '',
          textColor = '#ffffff',
          titleSize = 48,
          ctaText = '',
          ctaLink = '',
          order = 0,
          active = true,
          startAt = null,
          endAt = null
        } = fields;

        let imageUrl = '';
        const imageField = (fields.image || '').toString();
        if (imageField && imageField !== 'null' && imageField !== 'undefined') {
          imageUrl = imageField;
        }
        const imageFile = files.image;
        if (imageFile) {
          const uploaded = await cloudinary.v2.uploader.upload(imageFile.filepath, { folder: 'campaigns' });
          imageUrl = uploaded.url;
        }

        if (!imageUrl) return responseReturn(res, 400, { error: 'Image is required' });
        if (!title) return responseReturn(res, 400, { error: 'Title is required' });

        const campaign = await Campaign.create({
          title,
          subtitle,
          image: imageUrl,
          textColor,
          titleSize: Number(titleSize),
          ctaText,
          ctaLink,
          order: Number(order) || 0,
          active: String(active) !== 'false',
          startAt: startAt ? new Date(startAt) : null,
          endAt: endAt ? new Date(endAt) : null,
          createdBy: req.id || null
        });
        return responseReturn(res, 201, { campaign, message: 'Campaign created' });
      } catch (error) {
        console.log('Campaign create error:', error);
        return responseReturn(res, 500, { error: error.message });
      }
    });
  };

  // Update campaign (image optional)
  update = async (req, res) => {
    const { id } = req.params;
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      try {
        if (err) return responseReturn(res, 400, { error: err.message });
        const updates = { ...fields };

        // If image field contains a URL string, keep it; if file provided, upload
        const imageField = (fields.image || '').toString();
        if (imageField && imageField !== 'null' && imageField !== 'undefined') {
          updates.image = imageField;
        }
        if (files.image) {
          const uploaded = await cloudinary.v2.uploader.upload(files.image.filepath, { folder: 'campaigns' });
          updates.image = uploaded.url;
        }

        if (typeof updates.titleSize !== 'undefined') updates.titleSize = Number(updates.titleSize);
        if (typeof updates.order !== 'undefined') updates.order = Number(updates.order);
        if (typeof updates.active !== 'undefined') updates.active = String(updates.active) !== 'false';
        if (updates.startAt) updates.startAt = new Date(updates.startAt);
        if (updates.endAt) updates.endAt = new Date(updates.endAt);

        const campaign = await Campaign.findByIdAndUpdate(id, updates, { new: true });
        return responseReturn(res, 200, { campaign, message: 'Campaign updated' });
      } catch (error) {
        console.log('Campaign update error:', error);
        return responseReturn(res, 500, { error: error.message });
      }
    });
  };

  remove = async (req, res) => {
    try {
      const { id } = req.params;
      await Campaign.findByIdAndDelete(id);
      return responseReturn(res, 200, { message: 'Campaign deleted' });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  list = async (req, res) => {
    try {
      const items = await Campaign.find({}).sort({ order: 1, createdAt: -1 });
      return responseReturn(res, 200, { campaigns: items });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  get = async (req, res) => {
    try {
      const { id } = req.params;
      const campaign = await Campaign.findById(id);
      return responseReturn(res, 200, { campaign });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // Public listing for hero
  publicList = async (req, res) => {
    try {
      const now = new Date();
      const items = await Campaign.find({
        active: true,
        $and: [
          { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
          { $or: [{ endAt: null }, { endAt: { $gte: now } }] }
        ]
      }).sort({ order: 1, createdAt: -1 });
      return responseReturn(res, 200, { campaigns: items });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };
}

export default new CampaignController();

