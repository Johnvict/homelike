class ApiFeatures {
  constructor(
    query,
    queryString,
    geoData = { distance: null, lat: null, lng: null }
  ) {
    (this.query = query),
      (this.queryString = queryString),
      (this.geoData = geoData);
  }

  filter() {
    const queryObj = { ...this.queryString };
    // const excludeFields = ['latlng'];
    // excludeFields.forEach(el => {delete queryObj[el]});
    this.geoLocation();
    delete queryObj['latlng'];

    //ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  geoLocation() {
    if (!this.geoData.distance || !this.geoData.lng) return this;

    const distance = this.geoData.distance ? this.geoData.distance : 1;
    const radius = distance / 6378.1;

    this.query.find({
      location: {
        $geoWithin: {
          $centerSphere: [[this.geoData.lng, this.geoData.lat], radius],
        },
      },
    });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.sort('-__v ');
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
