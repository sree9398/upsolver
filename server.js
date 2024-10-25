// server.js or app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes =require('./routes/auth');
const Streams=require('./routes/StreamsRoutes');
const Resources=require('./routes/ResourcesRoutes');
const Blogs=require('./routes/BlogsRoute');
const Lists=require('./routes/ListsRoutes');
const app = express(); 
app.use(cors()); 
app.use(express.json()); 
 

app.use('/api', authRoutes);
app.use('/api', Streams);
app.use('/api', Resources);
app.use('/api',Blogs);
app.use('/api',Lists);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});

// MongoDB connection (ensure this is set up correctly)
mongoose
  .connect('mongodb+srv://sree9398:Sree%409398@cluster0.6b79x.mongodb.net/mernDB?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
