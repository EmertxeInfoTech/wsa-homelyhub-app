import { Property } from "../Models/PropertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";
import imagekit from "../utils/ImagekitIO.js";

const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images,
    } = req.body;
    const uploadedImages = [];

    for (const image of images) {
      const result = await imagekit.upload({
        file: image.url,
        fileName: `property_${Date.now()}.jpg`,
        folder: "property_images",
      });

      uploadedImages.push({ url: result.url, public_id: result.fileId });
    }
    const property = await Property.create({
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images: uploadedImages,
      userId: req.user.id,
    });

    res.status(200).json({ status: "success", data: { data: property } });
  } catch (error) {
    console.error("Error searching properties", error);
    res.status(404).json({ meesage: "fail", error: "Internal server error" });
  }
};

const getProperties = async (req, res) => {
  try {
    const features = new APIFeatures(Property.find(), req.query)
      .filter()
      .search()
      .paginate();

    const allProperties = await Property.find();
    const doc = await features.query;

    res.status(200).json({
      staus: "success",
      no_of_responses: doc.length,
      all_properties: allProperties.length,
      data: doc,
    });
  } catch (error) {
    console.error("Error searching properties: ", error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

const getUsersProperties = async (req, res) => {
  try {
    const userId = req.user._id;
    const property = await Property.find({ userId });
    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};

export { getProperty, createProperty, getProperties, getUsersProperties };
