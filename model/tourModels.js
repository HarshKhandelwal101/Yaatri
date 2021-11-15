const mongoose= require('mongoose');
const slugify= require('slugify');

const tourSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, "A tour must have a name"],
        unique: true,
        trim: true,
        maxlength:[40, "A name should be within 40 characters"],
        minlength:[10, "A name must have atleast 10 characters"],
        // validate: [validator.isAlpha, "Name must contain charaters only"]

    },
    slug: String,
    duration:{
         type:Number,
         required:[true, 'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true, 'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true, 'A tour must have a difficulty'],
        enum:{
        values:['easy', 'medium', 'difficult'],
        message:'difficulty must be easy, medium or difficult'
        }
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1, "Rating must be greater than 1.00"],
        max:[5, "Rating must be smaller than 5.00"],
        set: val => Math.round(val * 10) / 10 
    },

    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,"A tour must have a price"]
    },
    priceDiscount: {
        type:Number,
        validate:
        {
           validator: function(val){
            return val<this.price
        },
        message:'Discount Price must be less than actual price'
    }
    },
    summary:{
     type:String,
     required:[true, "A tour must have a description"],
      trim:true
    },
    description:{
        type:String,
        trim:true

    },
    createdAt:{
        type:Date,
        defaut:Date.now(),
        select:false
    },
    startDates:[Date],
    secretTour:{
        type:Boolean,
        dafault:false
    },
    imageCover:{
        type:String,
        required:[true, "A tour must have a cover image"]
    },
    images:[String],
    startLocation: {
        // GeoJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      },
      locations: [
        {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point']
          },
          coordinates: [Number],
          address: String,
          description: String,
          day: Number
        }
      ],
      guides: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        }
      ]
},{
    toJSON:{virtuals:true},
    toObject :{virtuals: true}
}

);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
