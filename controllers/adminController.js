const Category = require("../models/Category");
const Bank = require("../models/Bank");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  // DASHBOARD
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard", { title: "Dashboard" });
  },
  // AKHIR DASHBOARD

  // CATEGORY
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/view_category", {
        category,
        alert,
        title: "Category",
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", "Success add category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alerMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      req.flash("alertMessage", "Success update category");
      req.flash("alertStatus", "success");
      category.name = name;
      await category.save();
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash("alertMessage", "Success delete category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  // AKHIR CATEGORY

  // BANK
  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/bank/view_bank", { title: "Bank", alert, bank });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      const { nameBank, nomorRekening, name } = req.body;

      await Bank.create({
        name,
        nameBank,
        nomorRekening,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Success Add Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  editBank: async (req, res) => {
    try {
      const { id, nameBank, nomorRekening, name } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file == undefined) {
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.name = name;
        await bank.save();
        req.flash("alertMessage", "Success Edit tanpa gambar Bank");
        req.flash("alertStatus", "warning");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.name = name;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash("alertMessage", "Success Edit Bank dengan gambar");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertMessage", "Success Delete Bank");
      req.flash("alertStatus", "warning");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  // AKHIR BANK

  // ITEM
  viewItem: (req, res) => {
    res.render("admin/item/view_item", { title: "Item" });
  },
  // AKHIR ITEM

  // BOOKING
  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking", { title: "Booking" });
  },
  // AKHIR BOOKING
};
