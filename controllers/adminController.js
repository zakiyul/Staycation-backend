module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard");
  },
  viewCatogory: (req, res) => {
    res.render("admin/category/view_category");
  },
  viewBank: (req, res) => {
    res.render("admin/bank/view_bank");
  },
};
