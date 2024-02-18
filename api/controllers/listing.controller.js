import Listing from "../models/listing.model.js";
import errorHandler from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const userId = req.params.id;
  const listingId = req.params.idL;

  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only Delete Your Own Listing"));
  try {
    await Listing.findByIdAndDelete(req.params.idL);
    res.status(201).json("Listing has been Deleted!");
  } catch (error) {
    next(errorHandler(error));
  }
};
