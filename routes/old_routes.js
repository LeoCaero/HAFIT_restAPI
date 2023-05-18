
router.put("/cart/add", async (req, res) => {
    const { userId, productId, quantity } = req.body;
  
    try {
      let user = await User.findOne({ userId });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const filter = { userId, 'cartItems.productId': productId };
      const update = { $inc: { 'cartItems.$.quantity': quantity } };
      const options = { new: true, upsert: true };
  
      user = await User.findOneAndUpdate(filter, update, options);
  
      const cartItem = user.cartItems.find(item => item.productId.toString() === productId);
      const updatedQuantity = cartItem.quantity;
  
      res.send(`[${user.name} ID:${userId}][${productId}] -> QTT: ${updatedQuantity}.`);
  
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  
  
  router.put("/cart/remove", async (req, res) => {
    const { userId, productId, quantity } = req.body;
  
    try {
      let user = await User.findOne({ userId });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const cartItem = user.cartItems.find(item => item.productId.toString() === productId);
      if (!cartItem) {
        return res.status(404).send("Product not found in cart");
      }
  
      const currentQuantity = cartItem.quantity;
  
      if (currentQuantity < quantity) {
        return res.status(400).send("Quantity to remove is greater than current quantity in cart");
      }
  
      const filter = { userId, 'cartItems.productId': productId };
      const update = { $inc: { 'cartItems.$.quantity': -quantity } };
      const options = { new: true };
  
      user = await User.findOneAndUpdate(filter, update, options);
  
      const updatedCartItem = user.cartItems.find(item => item.productId.toString() === productId);
      const updatedQuantity = updatedCartItem.quantity;
  
      res.send(`[${user.name} ID:${userId}][${productId}] -> QTT: ${updatedQuantity}.`);
  
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });