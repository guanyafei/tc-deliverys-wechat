Page({
  data: {
    invoiceImg:'',
  },
  onLoad(options) {
    let invoiceImg = options.invoiceImg;
    this.setData({
      invoiceImg:invoiceImg
    })
  },
})
