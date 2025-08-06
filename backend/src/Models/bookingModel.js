import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
      required: [true, "Booking must belong to a Property!"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a User!"],
    },
    price: {
      type: Number,
      required: [true, "booking must have a time."],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paid: {
      type: Boolean,
      default: true,
    },
    fromDate: {
      type: Date,
    },
    toDate: {
      type: Date,
    },
    guests: {
      type: Number,
    },
    numberOfnights: {
      type: Number,
    },
  },
  { timestamps: true }
);

//Query Middleware
bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "property",
    select: "maximumGuest location images propertyName address",
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export { Booking };
