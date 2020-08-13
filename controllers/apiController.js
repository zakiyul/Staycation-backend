const Traveler = require("../models/Member");
const Treasure = require("../models/Feature");
const Item = require("../models/Item");
const Category = require("../models/Category");
const Booking = require("../models/Booking");
const Bank = require("../models/Bank");
const Member = require("../models/Member");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title city country price imageId unit")
        .limit(5)
        .populate({
          path: "imageId",
          select: "_id imageUrl",
          perDocumentLimit: 1,
        });
      const category = await Category.find()
        .select("_id name itemId")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title imageId country city isPopular",
          perDocumentLimit: 4,
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });
      const travelers = await Traveler.find();
      const treasure = await Treasure.find();
      const cities = await Item.find();

      for (let i = 0; i < category.length; i++) {
        for (let x = 0; x < category[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: category[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          if (category[i].itemId[0] === category[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.json({
        hero: {
          travelers: travelers.length,
          treasure: treasure.length,
          cities: cities.length,
        },
        mostPicked,
        category,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error!" });
    }
  },
  detailPage: async (req, res) => {
    const { id } = req.params;
    try {
      const item = await Item.findOne({ _id: id })
        .select(
          "_id title imageId featureId activityId country city price unit isPopular"
        )
        .populate({ path: "imageId", select: "_id imageUrl" })
        .populate({ path: "featureId", select: "_id name qty imageUrl" })
        .populate({ path: "activityId", select: "_id name type imageUrl" });
      const bank = await Bank.find();
      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial1.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon...",
        familyName: "Angga",
        familyOccupation: "UI Designer",
      };
      res.json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error!" });
    }
  },
  bookingPage: async (req, res) => {
    const {
      idItem,
      duration,
      price,
      bookingStartDate,
      bookingEndDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;
    if (!req.file) {
      return res.status(404).json({ message: "Image not found!" });
    }
    if (
      idItem == undefined ||
      duration == undefined ||
      //price == undefined ||
      bookingStartDate == undefined ||
      bookingEndDate == undefined ||
      firstName == undefined ||
      lastName == undefined ||
      email == undefined ||
      phoneNumber == undefined ||
      accountHolder == undefined ||
      bankFrom == undefined
    ) {
      return res.status(404).json({ message: "Lengkapi data anda!" });
    }

    const item = await Item.findOne({ _id: idItem });
    if (!item) {
      return res.status(404).json({ message: "Item not found!" });
    }
    item.sumBooking += 1;

    await item.save();

    let total = item.price * duration;
    let tax = total * 0.1;

    const invoice = Math.floor(1000000 + Math.random() * 9000000);

    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    const newBooking = {
      invoice,
      bookingStartDate,
      bookingEndDate,
      total: (total += tax),
      itemId: {
        _id: item.id,
        title: item.title,
        price: item.price,
        duration: duration,
      },
      memberId: member.id,
      payments: {
        proofPayment: `images/${req.file.filename}`,
        bankFrom: bankFrom,
        accountHolder: accountHolder,
      },
    };

    const booking = await Booking.create(newBooking);

    res.status(201).json({ message: "Success Booking!", booking: booking });
  },
};
